const startScanBtn = document.getElementById("startScanBtn");
const resultsBox = document.getElementById("results");
const statusBar = document.getElementById("statusBar");

startScanBtn.addEventListener("click", () => {
    
    const ip = document.getElementById("targetIp").value.trim();
    const ports = document.getElementById("ports").value.trim();

    if (!ip || !ports) {
        alert("Please enter both IP address and ports.");
        return;
    }

    resultsBox.value = "";
    statusBar.textContent = "Simulating scan...";

    const portList = ports.split(",").map(p => p.trim());

    let index = 0;

    const interval = setInterval(() => {
        if (index >= portList.length) {
            clearInterval(interval);
            statusBar.textContent = "Simulation complete ✔";
            return;
        }

        const port = portList[index];
        const open = Math.random() > 0.5;

        resultsBox.value += `Port ${port} → ${open ? "OPEN" : "CLOSED"}\n`;
        resultsBox.scrollTop = resultsBox.scrollHeight;

        index++;
    }, 600);
});
