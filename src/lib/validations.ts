import { z } from 'zod';
import { OrderStatus, ProductCategory, StoreOrder } from '../types';

/**
 * =======================================================================
 * 1. EQUIPMENT CATALOG SCHEMA & VALIDATION (Zod)
 * =======================================================================
 */

export const productCategorySchema = z.enum([
  'hammocks',
  'tents',
  'apparel',
  'gear',
  'accessories'
]);

export const productSpecsSchema = z.object({
  material: z.string().trim().min(2, { message: 'Technical material specification is required (e.g. 210T Ripstop Nylon, 500D PVC)' }),
  weight: z.string().trim().optional(),
  dimensions: z.string().trim().optional(),
  capacity: z.string().trim().optional(),
  colorway: z.string().trim().optional(),
  weatherRating: z.string().trim().optional(),
});

export const productItemSchema = z.object({
  id: z.string().min(1, { message: 'Product ID is required' }),
  name: z.string().trim().min(3, { message: 'Product name must be at least 3 characters' }).max(100, { message: 'Product name must not exceed 100 characters' }),
  subtitle: z.string().trim().min(5, { message: 'Subtitle must be at least 5 characters' }).max(200, { message: 'Subtitle must not exceed 200 characters' }),
  category: productCategorySchema,
  price: z.number()
    .positive({ message: 'Price must be greater than ₱0' })
    .max(500000, { message: 'Price cannot exceed ₱500,000 PHP' }),
  originalPrice: z.number().positive().optional().nullable(),
  rating: z.number().min(1).max(5).default(5.0),
  reviewCount: z.number().int().min(0).default(1),
  badge: z.string().trim().optional(),
  inStock: z.boolean(),
  stockCount: z.number()
    .int({ message: 'Stock units must be an integer' })
    .min(0, { message: 'Stock cannot be negative' })
    .max(50000, { message: 'Stock count exceeds realistic basecamp inventory limit (50,000)' }),
  description: z.string().trim().min(10, { message: 'Description must be at least 10 characters detailing ridge/trail use' }),
  features: z.array(z.string().trim().min(1, { message: 'Feature bullets cannot be empty' }))
    .min(1, { message: 'At least one key feature bullet is required' }),
  specs: productSpecsSchema,
  image: z.string().trim().min(1, { message: 'Product image path or URL is required' }),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string()
  })).optional(),
}).refine(data => {
  if (data.originalPrice !== undefined && data.originalPrice !== null) {
    return data.originalPrice >= data.price;
  }
  return true;
}, {
  message: 'Original price must be greater than or equal to current price',
  path: ['originalPrice']
});

export type ValidatedProduct = z.infer<typeof productItemSchema>;

/**
 * =======================================================================
 * 2. PHILIPPINE GCASH REFERENCE NUMBER VALIDATION
 * =======================================================================
 * Standard Philippine GCash transaction reference numbers issued by
 * Mynt / Globe Fintech are 13 consecutive digits (e.g., 9021482019481).
 * Customers or staff may paste numbers with spaces or dashes.
 */

export const sanitizeGcashReference = (raw: string): string => {
  if (!raw) return '';
  return raw.replace(/[^0-9]/g, '');
};

export const formatGcashReferenceDisplay = (cleanDigits: string): string => {
  const digits = sanitizeGcashReference(cleanDigits);
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 13)}`;
};

export const gcashReferenceSchema = z.string()
  .transform(val => sanitizeGcashReference(val))
  .pipe(
    z.string()
      .min(1, { message: 'GCash reference number is required for GCash payments' })
      .regex(/^\d{13}$/, {
        message: 'GCash reference number must be exactly 13 digits (e.g. 9021 4820 19481)'
      })
  );

export const validateGcashReferenceInput = (raw: string): { isValid: boolean; cleaned: string; error?: string } => {
  const cleaned = sanitizeGcashReference(raw);
  const result = gcashReferenceSchema.safeParse(cleaned);
  if (result.success) {
    return { isValid: true, cleaned: result.data };
  }
  const firstIssue = result.error.issues?.[0];
  return {
    isValid: false,
    cleaned,
    error: firstIssue?.message || 'Invalid GCash reference format'
  };
};

/**
 * =======================================================================
 * 3. DETERMINISTIC ORDER FINITE STATE MACHINE (FSM)
 * =======================================================================
 * Strict Pipeline:
 *  Pending Payment (pending_payment)
 *     ↓ (Payment verified with GCash / cash receipt)
 *  Verified (verified)
 *     ↓ (Basecamp staff pulling & packing gear)
 *  Preparing Gear (preparing)
 *     ↓ (Handed to LBC/J&T courier or placed at Cumba Basecamp locker)
 *  Dispatched (dispatched)
 *     ↓ (Customer confirmed receipt or delivered)
 *  Completed (completed) [Terminal]
 *
 * Any non-completed active order can be transition to Cancelled (cancelled) [Terminal].
 * Backwards transitions or skipping steps is blocked by the state machine.
 */

export const ORDER_FSM_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending_payment: ['verified', 'cancelled'],
  verified: ['preparing', 'cancelled'],
  preparing: ['dispatched', 'cancelled'],
  dispatched: ['completed', 'cancelled'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
} as const;

export interface StateMachineTransitionResult {
  allowed: boolean;
  reason?: string;
  suggestedAction?: string;
}

export const canTransitionOrderState = (
  fromStatus: OrderStatus,
  toStatus: OrderStatus
): StateMachineTransitionResult => {
  if (fromStatus === toStatus) {
    return { allowed: true };
  }

  const allowedNext = ORDER_FSM_TRANSITIONS[fromStatus] || [];
  if (allowedNext.includes(toStatus)) {
    return { allowed: true };
  }

  // Generate clear descriptive feedback for illegal jumps
  if (fromStatus === 'completed') {
    return {
      allowed: false,
      reason: 'Order is in a terminal "Completed" state and cannot be modified.'
    };
  }

  if (fromStatus === 'cancelled') {
    return {
      allowed: false,
      reason: 'Order was cancelled and cannot be reopened.'
    };
  }

  if (fromStatus === 'pending_payment' && (toStatus === 'preparing' || toStatus === 'dispatched' || toStatus === 'completed')) {
    return {
      allowed: false,
      reason: 'Order payment must be verified before gear preparation or dispatch.',
      suggestedAction: 'Verify GCash reference or payment first.'
    };
  }

  if (fromStatus === 'verified' && (toStatus === 'dispatched' || toStatus === 'completed')) {
    return {
      allowed: false,
      reason: 'Gear must be prepared and packed at Basecamp before dispatching.',
      suggestedAction: 'Transition to "Preparing Gear at Basecamp" first.'
    };
  }

  if (fromStatus === 'preparing' && toStatus === 'completed') {
    return {
      allowed: false,
      reason: 'Gear must be marked dispatched / in transit before marking as completed.',
      suggestedAction: 'Transition to "Dispatched / Ready for Pickup" first.'
    };
  }

  return {
    allowed: false,
    reason: `Invalid transition from "${fromStatus}" to "${toStatus}". Orders must follow the strict Basecamp workflow.`
  };
};

/**
 * Comprehensive Order Transition Guard including business validation
 * (e.g. GCash verification requires a valid reference number)
 */
export const validateOrderTransition = (
  order: StoreOrder,
  targetStatus: OrderStatus,
  providedGcashRef?: string
): StateMachineTransitionResult => {
  const fsmCheck = canTransitionOrderState(order.status, targetStatus);
  if (!fsmCheck.allowed) {
    return fsmCheck;
  }

  // Guard: When transitioning pending_payment -> verified for GCash orders,
  // there must be a valid 13-digit reference number
  if (order.status === 'pending_payment' && targetStatus === 'verified') {
    if (order.paymentOption === 'GCash') {
      const refToCheck = providedGcashRef ?? order.paymentReference;
      if (!refToCheck || sanitizeGcashReference(refToCheck).length !== 13) {
        return {
          allowed: false,
          reason: 'A verified 13-digit GCash reference number is required to confirm this payment.',
          suggestedAction: 'Input or verify the customer\'s 13-digit GCash receipt number.'
        };
      }
    }
  }

  return { allowed: true };
};

export const ORDER_STATUS_METADATA: Record<OrderStatus, {
  label: string;
  stepNumber: number;
  description: string;
  colorClass: string;
  badgeBg: string;
}> = {
  pending_payment: {
    label: 'Pending GCash / Settlement',
    stepNumber: 1,
    description: 'Awaiting buyer GCash transfer or counter verification',
    colorClass: 'text-amber-400',
    badgeBg: 'bg-amber-950/40 border-amber-800/40 text-amber-400'
  },
  verified: {
    label: 'Payment Verified',
    stepNumber: 2,
    description: 'GCash / cash confirmed by Basecamp staff',
    colorClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400'
  },
  preparing: {
    label: 'Preparing Gear at Basecamp',
    stepNumber: 3,
    description: 'Picking from inventory, inspection, and waterproof boxing',
    colorClass: 'text-blue-400',
    badgeBg: 'bg-blue-950/40 border-blue-800/40 text-blue-400'
  },
  dispatched: {
    label: 'Dispatched / In Transit',
    stepNumber: 4,
    description: 'In transit via courier or awaiting pickup at Cumba basecamp locker',
    colorClass: 'text-purple-400',
    badgeBg: 'bg-purple-950/40 border-purple-800/40 text-purple-400'
  },
  completed: {
    label: 'Completed & Delivered',
    stepNumber: 5,
    description: 'Gear received and inspected by customer',
    colorClass: 'text-teal-400',
    badgeBg: 'bg-teal-950/40 border-teal-800/40 text-teal-400'
  },
  cancelled: {
    label: 'Cancelled',
    stepNumber: 0,
    description: 'Order voided and inventory stock replenished',
    colorClass: 'text-red-400',
    badgeBg: 'bg-red-950/40 border-red-800/40 text-red-400'
  }
};
