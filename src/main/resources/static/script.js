const API_URL = "/api/reports";

let allReports = [];

async function loadReports() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load reports");
        }

        allReports = await response.json();

        displayReports(allReports);
        updateDashboard(allReports);

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the backend.");
    }
}

function displayReports(reports) {

    const tableBody = document.getElementById("reportTableBody");

    tableBody.innerHTML = "";

    if (reports.length === 0) {
        tableBody.innerHTML =
            `<tr>
                <td colspan="8" style="text-align:center;">
                    No reports found
                </td>
            </tr>`;

        return;
    }

    reports.forEach(report => {

        let statusClass = "status-pending";

        if (report.status === "Resolved") {
            statusClass = "status-resolved";
        }

        if (report.status === "In Progress") {
            statusClass = "status-progress";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${report.id}</td>

            <td>${escapeHtml(report.reporterName)}</td>

            <td>${escapeHtml(report.location)}</td>

            <td>${escapeHtml(report.category)}</td>

            <td>${escapeHtml(report.description)}</td>

            <td>${escapeHtml(report.priority)}</td>

            <td>
                <span class="status ${statusClass}">
                    ${escapeHtml(report.status)}
                </span>
            </td>

            <td>
                <button
                    class="action-btn"
                    onclick="editReport(${report.id})">
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteReport(${report.id})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

document
    .getElementById("reportForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const id = document.getElementById("reportId").value;

        const report = {
            reporterName:
                document.getElementById("reporterName").value.trim(),

            location:
                document.getElementById("location").value.trim(),

            category:
            document.getElementById("category").value,

            description:
                document.getElementById("description").value.trim(),

            priority:
            document.getElementById("priority").value,

            status:
            document.getElementById("status").value
        };

        try {

            let response;

            if (id) {

                response = await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(report)
                });

            } else {

                response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(report)
                });
            }

            if (!response.ok) {

                const errorData = await response.json();

                console.log(errorData);

                alert("Please fill all required fields.");

                return;
            }

            alert(
                id
                    ? "Report updated successfully!"
                    : "Report submitted successfully!"
            );

            resetForm();

            loadReports();

        } catch (error) {

            console.error(error);

            alert("Something went wrong.");
        }
    });

function editReport(id) {

    const report = allReports.find(
        r => r.id === id
    );

    if (!report) {
        return;
    }

    document.getElementById("reportId").value = report.id;

    document.getElementById("reporterName").value =
        report.reporterName;

    document.getElementById("location").value =
        report.location;

    document.getElementById("category").value =
        report.category;

    document.getElementById("description").value =
        report.description;

    document.getElementById("priority").value =
        report.priority;

    document.getElementById("status").value =
        report.status;

    document.getElementById("formTitle").textContent =
        "Update Sustainability Report";

    document.getElementById("submitButton").textContent =
        "Update Report";

    document.getElementById("cancelButton").style.display =
        "inline-block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function deleteReport(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this report?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Report deleted successfully!");

        loadReports();

    } catch (error) {

        console.error(error);

        alert("Unable to delete report.");
    }
}

function searchReports() {

    const search =
        document.getElementById("searchInput")
            .value
            .toLowerCase();

    const filtered = allReports.filter(report =>
        report.location
            .toLowerCase()
            .includes(search)
    );

    displayReports(filtered);
}

function filterReports() {

    const category =
        document.getElementById("filterCategory").value;

    const status =
        document.getElementById("filterStatus").value;

    let filtered = allReports;

    if (category) {
        filtered = filtered.filter(
            report => report.category === category
        );
    }

    if (status) {
        filtered = filtered.filter(
            report => report.status === status
        );
    }

    displayReports(filtered);
}

function updateDashboard(reports) {

    document.getElementById("totalReports").textContent =
        reports.length;

    document.getElementById("pendingReports").textContent =
        reports.filter(
            r => r.status === "Pending"
        ).length;

    document.getElementById("resolvedReports").textContent =
        reports.filter(
            r => r.status === "Resolved"
        ).length;

    document.getElementById("highReports").textContent =
        reports.filter(
            r => r.priority === "High"
        ).length;
}

function cancelEdit() {
    resetForm();
}

function resetForm() {

    document.getElementById("reportForm").reset();

    document.getElementById("reportId").value = "";

    document.getElementById("formTitle").textContent =
        "Report a Sustainability Issue";

    document.getElementById("submitButton").textContent =
        "Submit Report";

    document.getElementById("cancelButton").style.display =
        "none";
}

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}

loadReports();