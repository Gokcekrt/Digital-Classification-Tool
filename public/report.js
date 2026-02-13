document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("printDate").textContent =
    new Date().toLocaleString();
  const storedData = localStorage.getItem("athleteReport");

  if (!storedData) {
    alert("No data found! Going back.");
    window.location.href = "index.html";
    return;
  }
  const data = JSON.parse(storedData);
  document.getElementById("resName").textContent =
    " " + data.personal.givenName + " " + data.personal.familyName;
  document.getElementById("resDob").textContent =
    " " + data.personal.dateOfBirth;
  document.getElementById("resTeam").textContent = " " + data.personal.teamName;
  const flagResContainer = document.getElementById("resFlag");
  if (data.personal.flagUrl) {
    flagResContainer.innerHTML = `<img src="${data.personal.flagUrl}" alt="Flag" style="width: 30px; height: auto;">`;
  }
  document.getElementById("resEvent").textContent =
    " " + data.personal.eventName + "(" + data.personal.eventStatus + ")";
  document.getElementById("resDateClassification").textContent =
    " " + data.personal.classificationDate;

  document.getElementById("resCondition").textContent =
    " " + data.generalHealthInfo.underlyingHealthCondition;
  document.getElementById("resEvidence").textContent =
    " " + data.generalHealthInfo.supportiveEvidence;
  document.getElementById("resMissingEvidence").textContent =
    " " + data.generalHealthInfo.missingDoc;
  document.getElementById("resImpType").textContent =
    " " + data.impairmentTypeLabel;

  document.getElementById("resNotes").textContent = " " + data.notes;
  document.getElementById("resDecision").textContent =
    " " + data.selectedClass.toUpperCase();
});

function startNewAssessment() {
  const confirmNewAthleteVar = document.getElementById("startNewAthlete");
  confirmNewAthleteVar.removeAttribute("hidden");
}

function closeModal() {
  document.getElementById("startNewAthlete").style.display = "none";
}
function confirmNewAthlete() {
  localStorage.removeItem("athleteReport");
  window.location.href = "index.html";
}
