"use client";

import { useState, useEffect, useCallback } from "react";
import { formatUsd } from "@/lib/utils";

type Employee = {
  id?: string;
  employeeId?: string;
  name?: string;
  employeeName?: string;
  email: string;
  position?: string;
  country: string;
  salaryUsd: number;
};

export default function EmployeeTable({
  companyId,
  onEmployeesChange,
}: {
  companyId: string;
  onEmployeesChange?: (employees: Employee[]) => void;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [globalSearchResults, setGlobalSearchResults] = useState<Employee[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [salaryInput, setSalaryInput] = useState("3000");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (onEmployeesChange) {
      onEmployeesChange(employees);
    }
  }, [employees, onEmployeesChange]);

  useEffect(() => {
    let isMounted = true;

    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/company/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (isMounted && data.employees) {
          setEmployees(data.employees);
        }
      } catch (err) {
        console.error("Fetch employees error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();
    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const searchGlobalEmployees = useCallback(async () => {
    setSearching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/employees/search?q=${globalSearch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGlobalSearchResults(data.employees || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  }, [globalSearch]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (globalSearch.length >= 2) {
        searchGlobalEmployees();
      } else {
        setGlobalSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [globalSearch, searchGlobalEmployees]);

  const filteredEmployees = employees.filter((e) =>
    (e.employeeName || e.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/company/${companyId}/employees?employeeId=${employeeToDelete.employeeId || employeeToDelete.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEmployees(data.employees);
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleAdd = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSalaryInput("3000");
    setShowSalaryModal(true);
  };

  const handleAddConfirm = async () => {
    if (!selectedEmployee) return;

    const salary = parseFloat(salaryInput);
    if (isNaN(salary) || salary <= 0) {
      alert("Please enter a valid salary amount.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/company/${companyId}/employees`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          employeeId: selectedEmployee.id || selectedEmployee.employeeId, 
          salaryUsd: salary
        })
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(data.employees);
        setGlobalSearch("");
        setShowAddModal(false);
        setShowSalaryModal(false);
        setSelectedEmployee(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  if (loading) return <div className="muted p-4">Loading team...</div>;

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
            placeholder="Search by email or name..."
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

          {searching && <p className="tiny muted">Searching database...</p>}

          {globalSearchResults.length > 0 && (
            <div className="search-results" style={{ display: 'grid', gap: '0.75rem' }}>
              {globalSearchResults.map(result => (
                <div key={result.id || result.employeeId} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.5rem'
                }}>
                  <div>
                    <strong style={{ color: '#fff', display: 'block' }}>{result.name || result.employeeName}</strong>
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
          {globalSearch.length >= 2 && !searching && globalSearchResults.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>No employees found in database.</p>
          )}
        </div>
      )}

      {showSalaryModal && selectedEmployee && (
        <div className="salary-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="salary-modal" style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #2dd4bf',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ color: '#fff', margin: '0 0 1rem 0' }}>
              Set Monthly Salary
            </h3>
            <p style={{ color: '#94a3b8', margin: '0 0 1.5rem 0' }}>
              Enter monthly salary (USD) for {selectedEmployee.name || selectedEmployee.employeeName}
            </p>
            <input
              type="number"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
              placeholder="3000"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #2dd4bf',
                borderRadius: '0.5rem',
                color: '#fff',
                marginBottom: '1.5rem',
                fontSize: '1rem'
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowSalaryModal(false);
                  setSelectedEmployee(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'none',
                  border: '1px solid #94a3b8',
                  borderRadius: '0.5rem',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddConfirm}
                className="cta-btn"
                style={{ padding: '0.5rem 1rem' }}
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && employeeToDelete && (
        <div className="delete-modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.96)',
            border: '1px solid rgba(248, 113, 113, 0.25)',
            borderRadius: '1rem',
            padding: '1.75rem',
            width: 'min(420px, 90%)'
          }}>
            <h3 style={{ color: '#fff', margin: '0 0 0.75rem 0' }}>Remove employee?</h3>
            <p style={{ color: '#cbd5e1', margin: '0 0 1.5rem 0' }}>
              Are you sure you want to remove <strong>{employeeToDelete.employeeName || employeeToDelete.name}</strong> from the team? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelDelete}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #475569',
                  background: 'transparent',
                  color: '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="cta-btn"
                style={{ padding: '0.65rem 1rem' }}
              >
                {deleteLoading ? 'Removing…' : 'Remove employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Role</th>
              <th>Country</th>
              <th>Salary</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.employeeId || employee.id}>
                <td>
                  <strong style={{ color: '#fff' }}>{employee.employeeName || employee.name}</strong>
                </td>
                <td style={{ color: '#94a3b8', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: '0.95rem' }}>
                  {employee.email}
                </td>
                <td>{employee.position || 'Employee'}</td>
                <td>{employee.country}</td>
                <td>{formatUsd(employee.salaryUsd)}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(employee)}
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
                  {searchTerm ? `No employees found matching "${searchTerm}"` : "Your team directory is empty."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
