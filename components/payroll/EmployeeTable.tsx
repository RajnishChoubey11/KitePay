import { demoEmployees, formatUsd } from "@/lib/demoData";

export default function EmployeeTable() {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Country</th>
            <th>Salary</th>
            <th>Payout</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {demoEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <strong>{employee.name}</strong>
                <span>{employee.email}</span>
              </td>
              <td>
                {employee.country}
                <span>{employee.currency}</span>
              </td>
              <td>{formatUsd(employee.salaryUsd)}</td>
              <td>{employee.payoutMethod}</td>
              <td>
                <span className={employee.status === "Ready" ? "pill success" : "pill warn"}>
                  {employee.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
