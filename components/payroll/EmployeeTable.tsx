"use client";

import { useState } from "react";
import { demoEmployees, formatUsd, Employee } from "@/lib/demoData";

// Mock Global Employee Database
const globalEmployeeDB: Employee[] = [
  ...demoEmployees,
  {
    id: "emp_005",
    name: "Elena Rodriguez",
    email: "elena@example.com",
    country: "Spain",
    currency: "EUR",
    salaryUsd: 4500,
    payoutMethod: "Local currency",
    wallet: "0xabc...",
    bank: "Santander",
    status: "Ready",
  },
  {
    id: "emp_006",
    name: "Hiroshi Tanaka",
    email: "hiroshi@example.com",
    country: "Japan",
    currency: "JPY",
    salaryUsd: 5500,
    payoutMethod: "Crypto",
    wallet: "0xdef...",
    bank: "MUFG",
    status: "Ready",
  },
  {
    id: "emp_007",
    name: "Lukas Müller",
    email: "lukas@example.com",
    country: "Germany",
    currency: "EUR",
    salaryUsd: 4800,
    payoutMethod: "Local currency",
    wallet: "0xghi...",
    bank: "Deutsche Bank",
    status: "Ready",
  },
];

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const globalSearchResults = globalSearch.trim() === ""
    ? []
    : globalEmployeeDB.filter((e) =>
      e.name.toLowerCase().includes(globalSearch.toLowerCase()) &&
      !employees.find(existing => existing.id === e.id)
    );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this employee?")) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  const handleAdd = (employee: Employee) => {
    setEmployees([...employees, employee]);
    setGlobalSearch("");
    setShowAddModal(false);
  };

  return (
    <div className="employee-mgmt">
      <div className="table-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search team..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid #263244',
            borderRadius: '0.75rem',
            padding: '0.6rem 1rem',
            color: '#fff',
            flex: '1',
            maxWidth: '20rem'
          }}
        />
        <button
          className="cta-btn small"
          onClick={() => setShowAddModal(true)}
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}
        >
          Add Employee
        </button>
      </div>

      {showAddModal && (
        <div className="add-employee-section" style={{
          background: 'rgba(20, 184, 166, 0.05)',
          border: '1px solid rgba(20, 184, 166, 0.2)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Find employee to add</h3>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by email..."
            className="search-input full"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            autoFocus
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid #2dd4bf',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              color: '#fff',
              marginBottom: '1rem'
            }}
          />

          {globalSearchResults.length > 0 && (
            <div className="search-results" style={{ display: 'grid', gap: '0.75rem' }}>
              {globalSearchResults.map(result => (
                <div key={result.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.5rem'
                }}>
                  <div>
                    <strong style={{ color: '#fff', display: 'block' }}>{result.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{result.email} • {result.country}</span>
                  </div>
                  <button
                    className="cta-btn tiny"
                    onClick={() => handleAdd(result)}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                  >
                    Add to Team
                  </button>
                </div>
              ))}
            </div>
          )}
          {globalSearch && globalSearchResults.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>No matches found in global database.</p>
          )}
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Country</th>
              <th>Salary</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <strong style={{ color: '#fff' }}>{employee.name}</strong>
                </td>
                <td>{employee.email}</td>
                <td>{employee.country}</td>
                <td>{formatUsd(employee.salaryUsd)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No employees found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
