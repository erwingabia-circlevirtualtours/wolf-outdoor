import React, { useState, useMemo } from 'react';
import { 
  Search, Users, CheckCircle2, Clock, Phone, QrCode, 
  Download, Trash2, Tent, Shield, AlertCircle
} from 'lucide-react';
import { CampRegistration } from '../../types';
import { useStore } from '../../context/StoreContext';

export const AdminCampFestTab: React.FC = () => {
  const { campRegistrations, updateRegistrationStatus, deleteRegistration } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Hiker' | 'Mountain Biker' | 'Camper'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Pending'>('All');

  const filteredRegistrations = useMemo(() => {
    return campRegistrations.filter(reg => {
      const matchesSearch =
        reg.joinerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.contactNumber.includes(searchQuery) ||
        reg.qrCodeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || reg.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'Confirmed') {
        matchesStatus = reg.status === 'Confirmed';
      } else if (statusFilter === 'Pending') {
        matchesStatus = reg.status === 'Pending Basecamp Verification';
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [campRegistrations, searchQuery, categoryFilter, statusFilter]);

  // Metrics
  const totalHikers = campRegistrations.filter(r => r.category === 'Hiker').length;
  const totalBikers = campRegistrations.filter(r => r.category === 'Mountain Biker').length;
  const totalCampers = campRegistrations.filter(r => r.category === 'Camper').length;
  const totalTentsRented = campRegistrations.filter(r => r.gearRental.tent).length;
  const totalHammocksRented = campRegistrations.filter(r => r.gearRental.hammock).length;
  const confirmedCount = campRegistrations.filter(r => r.status === 'Confirmed').length;

  const handleExportCSV = () => {
    const headers = ['Registration ID', 'Joiner Name', 'Category', 'Contact Number', 'Emergency Contact', 'Emergency Phone', 'Trail Experience', 'Rent Hammock', 'Rent Tent', 'Date', 'Fee PHP', 'Payment Method', 'QR ID', 'Status', 'Dietary Notes'];
    const rows = campRegistrations.map(r => [
      `"${r.id}"`,
      `"${r.joinerName.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.contactNumber}"`,
      `"${r.emergencyContactName.replace(/"/g, '""')}"`,
      `"${r.emergencyContactPhone}"`,
      `"${r.trailExperience.replace(/"/g, '""')}"`,
      r.gearRental.hammock ? 'YES' : 'NO',
      r.gearRental.tent ? 'YES' : 'NO',
      `"${r.registrationDate}"`,
      r.registrationFeePhp,
      `"${r.paymentMethod}"`,
      `"${r.qrCodeId}"`,
      `"${r.status}"`,
      `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mt_ulanin_campfest_participants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#12151c] p-3 rounded-xl border border-[#222a3a]">
          <span className="text-slate-400 text-xs font-mono block">Registered Joiners</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {campRegistrations.length} / 120
          </div>
          <span className="text-[10px] text-emerald-500 font-medium">{confirmedCount} confirmed tickets</span>
        </div>

        <div className="bg-[#12151c] p-3 rounded-xl border border-[#222a3a]">
          <span className="text-slate-400 text-xs font-mono block">Hikers (Summit Route)</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {totalHikers}
          </div>
          <span className="text-[10px] text-slate-500">710 MASL Ridge</span>
        </div>

        <div className="bg-[#12151c] p-3 rounded-xl border border-[#222a3a]">
          <span className="text-slate-400 text-xs font-mono block">Mountain Bikers</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {totalBikers}
          </div>
          <span className="text-[10px] text-slate-500">Cross-country singletrack</span>
        </div>

        <div className="bg-[#12151c] p-3 rounded-xl border border-[#222a3a]">
          <span className="text-slate-400 text-xs font-mono block">Tents Reserved</span>
          <div className="text-xl font-bold font-mono text-orange-400 mt-1">
            {totalTentsRented}
          </div>
          <span className="text-[10px] text-slate-500">WOLF 2P Expedition Domes</span>
        </div>

        <div className="bg-[#12151c] p-3 rounded-xl border border-[#222a3a]">
          <span className="text-slate-400 text-xs font-mono block">Hammocks Reserved</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {totalHammocksRented}
          </div>
          <span className="text-[10px] text-slate-500">210T Ripstop with Tree Straps</span>
        </div>
      </div>

      {/* Action & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#12151c] p-3.5 rounded-xl border border-[#222a3a]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search joiner name, mobile, registration ID..."
            className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a202c] hover:bg-[#252e3e] text-slate-300 hover:text-white border border-[#2e3747] text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Joiners Roster (CSV)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        <div className="flex flex-wrap gap-1">
          {(['All', 'Hiker', 'Mountain Biker', 'Camper'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-[#141820] text-slate-400 border-[#222a3a] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-1 ml-auto">
          {(['All', 'Confirmed', 'Pending'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-orange-600/20 text-orange-300 border-orange-500/50'
                  : 'bg-[#141820] text-slate-400 border-[#222a3a] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-[#12151c] border border-[#222a3a] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0e1015] border-b border-[#222a3a] text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Joiner & Ticket ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Gear Rentals</th>
                <th className="py-3 px-4">Emergency Contact</th>
                <th className="py-3 px-4">Registration Fee</th>
                <th className="py-3 px-4">Status & Action</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2533]">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-sm font-medium">No registrations found matching criteria</p>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map(reg => {
                  const isConfirmed = reg.status === 'Confirmed';

                  return (
                    <tr key={reg.id} className="hover:bg-[#161a23] transition-colors">
                      {/* Joiner Name & QR code */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white text-sm">
                          {reg.joinerName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <a href={`tel:${reg.contactNumber}`} className="hover:text-emerald-400">
                            {reg.contactNumber}
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          ID: {reg.id} · QR: {reg.qrCodeId}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          reg.category === 'Hiker'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                            : reg.category === 'Mountain Biker'
                            ? 'bg-orange-950/40 text-orange-400 border-orange-800/40'
                            : 'bg-blue-950/40 text-blue-400 border-blue-800/40'
                        }`}>
                          {reg.category}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 max-w-[140px] truncate">
                          {reg.trailExperience}
                        </div>
                      </td>

                      {/* Gear Rentals */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {reg.gearRental.hammock && (
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-[10px] font-medium mr-1">
                              + Hammock (₱350)
                            </span>
                          )}
                          {reg.gearRental.tent && (
                            <span className="inline-block px-2 py-0.5 rounded bg-orange-950/40 text-orange-300 border border-orange-800/40 text-[10px] font-medium">
                              + 2P Tent (₱700)
                            </span>
                          )}
                          {!reg.gearRental.hammock && !reg.gearRental.tent && (
                            <span className="text-slate-500 text-[11px]">Own gear</span>
                          )}
                        </div>
                      </td>

                      {/* Emergency Contact */}
                      <td className="py-3 px-4">
                        <div className="text-slate-300 font-medium text-xs">
                          {reg.emergencyContactName}
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono">
                          {reg.emergencyContactPhone}
                        </div>
                        {reg.dietaryNotes && (
                          <div className="text-[10px] text-amber-400 mt-0.5 max-w-[160px] truncate" title={reg.dietaryNotes}>
                            ⚠️ {reg.dietaryNotes}
                          </div>
                        )}
                      </td>

                      {/* Fee & Payment */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-white text-sm">
                          ₱{reg.registrationFeePhp.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-mono">
                          {reg.paymentMethod}
                        </div>
                      </td>

                      {/* Status & Toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const nextStatus = isConfirmed ? 'Pending Basecamp Verification' : 'Confirmed';
                            updateRegistrationStatus(reg.id, nextStatus);
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                            isConfirmed
                              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-700/50 hover:bg-emerald-900/60'
                              : 'bg-amber-950/50 text-amber-400 border-amber-700/50 hover:bg-amber-900/60'
                          }`}
                          title="Click to toggle ticket status"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isConfirmed ? 'Ticket Confirmed' : 'Verify & Issue'}</span>
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove joiner ${reg.joinerName}?`)) {
                              deleteRegistration(reg.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-[#1a202c] hover:bg-red-950/60 text-slate-500 hover:text-red-400 border border-[#2b3344] hover:border-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
