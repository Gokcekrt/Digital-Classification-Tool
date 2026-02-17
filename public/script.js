// ==========================
// 0) DATA
// ==========================

let tempData = {
  personal: {},
  generalHealthInfo: {},
  impairmentType: null,
  measures: {
    AmputationDismelia: { dismeliaUpperLimb: {} },
    LegLengthDifference: { shorteningLowerLimb: {} },
    ImpairedMusclePower: {
      lossMpOneUpperLimb: {},
      lossMpOneOrBothLowerLimb: {},
    },
  },
  impairmentTypeLabel: null,
  sectionId: null,
  spesificImpairment: null,
  spesificImpairmentLabel: null,
  selectedClass: null,
  notes: null,
};

let finalAthleteRecord = {};

// ==========================
// 1) STEP1 - VALIDATIONS
// ==========================

//regex : changeable
const onlyLetters = /^[\p{L}\s-]+$/u;

function showError(input, error, message) {
  if (!input || !error) return;
  error.textContent = message;
  error.classList.remove("hidden");
  input.setAttribute("aria-invalid", "true");
  input.classList.add("border-red-400", "bg-red-50", "ring-2", "ring-red-100");
  input.classList.remove("bg-gray-50", "border-gray-200");
}

function cleanError(input, error) {
  if (!input || !error) return;
  error.textContent = "";
  error.classList.add("hidden");
  input.setAttribute("aria-invalid", "false");
  input.classList.add("bg-gray-50", "border-gray-200");
  input.classList.remove(
    "border-red-400",
    "bg-red-50",
    "ring-2",
    "ring-red-100",
  );
}

function validateTextFields(input, error, regex, message) {
  const value = input.value;
  if (!value || value.trim() === "") {
    cleanError(input, error);
    return false;
  }
  if (!regex.test(value)) {
    showError(input, error, message);
    return false;
  }
  cleanError(input, error);
  return true;
}

// Step1 globals
let step1Btn;
let textFields = [];
let dateFields = [];

function validateDateFields(input, error) {
  const value = input.value;
  if (!value) {
    cleanError(input, error);
    return false;
  }
  cleanError(input, error);
  return true;
}

function validateStep1() {
  if (!step1Btn) return false;

  let isStep1Valid = true;

  textFields.forEach(({ input, error }) => {
    const ok = validateTextFields(
      input,
      error,
      onlyLetters,
      "Only letters, spaces and - are allowed.",
    );
    if (!ok) isStep1Valid = false;
  });

  dateFields.forEach(({ input, error }) => {
    const ok = validateDateFields(input, error);
    if (!ok) isStep1Valid = false;
  });

  step1Btn.disabled = !isStep1Valid;
  return isStep1Valid;
}

document.addEventListener("DOMContentLoaded", () => {
  step1Btn = document.getElementById("proceedStep1Button");

  textFields = [
    {
      input: document.getElementById("family-name"),
      error: document.getElementById("familyNameError"),
    },
    {
      input: document.getElementById("given-name"),
      error: document.getElementById("givenNameError"),
    },
    {
      input: document.getElementById("team-name"),
      error: document.getElementById("teamNameError"),
    },
    {
      input: document.getElementById("event-name"),
      error: document.getElementById("eventNameError"),
    },
  ];

  dateFields = [
    {
      input: document.getElementById("date-of-birth"),
      error: document.getElementById("dobError"),
    },
    {
      input: document.getElementById("date-of-classification"),
      error: document.getElementById("dateOfClassificationError"),
    },
  ];

  textFields.forEach(({ input }) =>
    input.addEventListener("input", validateStep1),
  );
  dateFields.forEach(({ input }) =>
    input.addEventListener("change", validateStep1),
  );

  validateStep1();

  step1Btn.addEventListener("click", () => {
    if (!validateStep1()) return;
    if (!validateStep1Dates()) return;
    nextStep();
  });
});

//validation for date of classification and date of birth -that will be call for process button step 1

function validateStep1Dates() {
  const docInput = document.getElementById("date-of-classification");
  const dobInput = document.getElementById("date-of-birth");
  const docErrorMes = document.getElementById("dateOfClassificationError");
  const dobDateErrorMes = document.getElementById("dobError");
  const today = new Date();

  if (!docInput.value || !dobInput.value) {
    return false;
  }

  //we will take this variable after input info came
  const dobDate = new Date(dobInput.value);
  const docDate = new Date(docInput.value); //for converting string to comperable info

  if (isNaN(dobDate) || isNaN(docDate)) return false;

  const calcAthletesAge = docDate.getFullYear() - dobDate.getFullYear();

  cleanError(docInput, docErrorMes);
  cleanError(dobInput, dobDateErrorMes);

  if (today < dobDate) {
    showError(
      dobInput,
      dobDateErrorMes,
      "Date of birth cannot be in the future.",
    );
    return false;
  } else if (calcAthletesAge < 15) {
    showError(
      dobInput,
      dobDateErrorMes,
      "Athletes must be at least 15 years old.",
    );
    return false;
  } else if (docDate.getFullYear() < 1950) {
    showError(docInput, docErrorMes, "Year must be 1950 or later.");
    return false;
  } else if (docDate > today) {
    showError(docInput, docErrorMes, "Cannot be later than today.");
    return false;
  } else if (docDate.getFullYear() < dobDate.getFullYear()) {
    showError(docInput, docErrorMes, "Cannot be earlier than birth date.");
    return false;
  } else {
    return true;
  }
}

// ==========================
// 2) STEP2 - VALIDATIONS
// ==========================

//Basic validations for the stabil elements on the page
const step2TextRegex = /^[A-Za-z0-9\s.,:;()'"\/\-+%]+$/;

const text2Fields = [
  {
    input: document.getElementById("underlyingHealthCondition"),
    error: document.getElementById("uhcError"),
  },
  {
    input: document.getElementById("supportiveEvidence"),
    error: document.getElementById("supEvidError"),
  },
  {
    input: document.getElementById("missingDoc"),
    error: document.getElementById("missingDocError"),
  },
];

const impairmentType = document.getElementById("impairment-type");
const spesificImpairment = document.getElementById("spesificImpairment");

document.getElementById("spesificImpairment").value;

const viewLogicBtn = document.getElementById("viewLogicBtn");

function validationStep2Base() {
  const viewLogicBtn = document.getElementById("viewLogicBtn");
  const impairmentType = document.getElementById("impairment-type");
  const spesificImpairment = document.getElementById("spesificImpairment");
  let textChecked = true;

  text2Fields.forEach((fields) => {
    const input = fields.input;
    const error = fields.error;
    if (
      !validateTextFields(
        input,
        error,
        step2TextRegex,
        "Use English letters/numbers and basic punctuation only.",
      )
    ) {
      textChecked = false;
    }
  });

  const selectChecked =
    impairmentType.value !== "0" && spesificImpairment.value !== "0";
  const allChecked = textChecked && selectChecked;
  if (allChecked === true) {
    viewLogicBtn.disabled = false;
  } else {
    viewLogicBtn.disabled = true;
  }

  return allChecked;
}

text2Fields.forEach((fields) => {
  const input = fields.input;
  input.addEventListener("input", () => {
    validationStep2Base();
    updateStep2Buttons();
  });
});

impairmentType.addEventListener("change", () => {
  tempData.selectedClass = null;
  tempData.sectionId = null;
  updateModels();
  validationStep2Base();
  updateStep2Buttons();
});

spesificImpairment.addEventListener("change", () => {
  tempData.selectedClass = null;
  tempData.sectionId = null;
  validationStep2Base();
  updateStep2Buttons();
});

function updateStep2Buttons() {
  const viewLogicBtn = document.getElementById("viewLogicBtn");
  const completedBtn = document.getElementById("btnCompleted");

  const baseOk = validationStep2Base();
  const sectionOk = tempData.selectedClass ? true : false;

  if (completedBtn) {
    if (baseOk && sectionOk) {
      completedBtn.disabled = false;
    } else {
      completedBtn.disabled = true;
    }
  }
}

// ==========================
// 3) GLOBAL DATA AND OBJECTS
// ==========================

const impairmentTypeSelect = document.getElementById("impairment-type");
const sectionMpUpperLimbLoss = document.getElementById("lossMpOneUpperLimb");
const sectionMpLowerLimbLoss = document.getElementById(
  "lossMpOneOrBothLowerLimb",
);

//At the beginning of the assessment (DOMContentLoaded), these values are
// automatically populated into the input fields via 'fillDefaultROM()' function.)
const normalLowerLimbROMValues = {
  hipFlexion: 120,
  hipExtension: 20,
  hipAbduction: 45,
  hipAdduction: 45,
  kneeFlexion: 150,
  kneeExtension: 180, //normal ROM: 0 degree
  ankleDorsiflexion: 30,
  anklePlantarflexion: 45,
};

const normalUpperLimbRomValues = {
  shoulderFlexion: 180,
  shoulderAbduction: 180,
  shoulderAdduction: 45,
  shoulderExtension: 45,
  elbowFlexion: 150,
  elbowExtension: 180, //normal ROM: 0 degree
  foreArmPronation: 90,
  foreArmSupination: 90,
  wristDorsiflexion: 80,
  wristVolarflexion: 70,
};

// Impairment Types Object
const impairmentTypes = {
  AmputationDismelia: {
    label: "Limb Deficiency(Amputation-Dismelia)",
    spesificImpairments: {
      0: { label: "Select Spesific Impairment" },
      amputationOneUpperLimb: {
        label: "Amputation One Upper Limb",
        sectionId: "amputationOneUpperLimb",
      },
      amputationBothUpperLimb: {
        label: "Amputation Both Upper Limb",
        sectionId: "amputationBothUpperLimb",
      },
      amputationLowerLimb: {
        label: "Amputation Lower Limb",
        sectionId: "amputationLowerLimb",
      },
      amputationUpperLowerLimb: {
        label: "Amputation Upper Lower Limb",
        sectionId: "amputationUpperLowerLimb",
      },
      dismeliaUpperLimb: {
        label: "Dismelia Upper Limb",
        sectionId: "dismeliaUpperLimb",
      },
    },
  },
  LegLengthDifference: {
    label: "Leg Length Difference",
    spesificImpairments: {
      0: { label: "Select Spesific Impairment" },
      shorteningLowerLimb: {
        label: "Shortening Lower Limb",
        sectionId: "shorteningLowerLimb",
      },
    },
  },
  ImpairedMusclePower: {
    label: "Impaired Muscle Power",
    spesificImpairments: {
      0: { label: "Select Spesific Impairment" },
      lossMpOneUpperLimb: {
        label: "Loss of muscle power in one upper limb",
        sectionId: "lossMpOneUpperLimb",
      },
      lossMpOneOrBothLowerLimb: {
        label: "Loss of muscle power in one or both lower limbs",
        sectionId: "lossMpOneOrBothLowerLimb",
      },
    },
  },
  ImpairedPassiveROM: {
    label: "Impaired Passive ROM",
    spesificImpairments: {
      0: { label: "Select Spesific Impairment" },
      promShoulder: {
        label: "Impaired Passive ROM for shoulder",
        sectionId: "promShoulder",
      },
      promElbowOneSide: {
        label: "Impaired Passive ROM for elbow on one side",
        sectionId: "promElbowOneSide",
      },
      promWristOneSide: {
        label: "Impaired Passive ROM for wrist on one side",
        sectionId: "promWristOneSide",
      },
      promFingers: {
        label: "Impaired Passive ROM for fingers",
        sectionId: "promFingers",
      },
      promHip: { label: "Impaired Passive ROM for hip", sectionId: "promHip" },
      promKneeOneSide: {
        label: "Impaired Passive ROM for knee on one side",
        sectionId: "promKneeOneSide",
      },
      promAnkle: {
        label: "Impaired Passive ROM for ankle",
        sectionId: "promAnkle",
      },
    },
  },
  SpasticityAthetosisAtaxia: {
    label: "Hypertonia-Athetosis-Ataxia",
    spesificImpairments: {
      0: { label: "Select Spesific Impairment" },
      "CP-ISRA": { label: "CP-ISRA", sectionId: "CpIsra" },
    },
  },
};

// ==========================
// 4) RESTORE HELPERS
// ==========================

function restoreSection(id) {
  if (id === "dismeliaUpperLimb") {
    const saved = tempData.measures?.AmputationDismelia?.dismeliaUpperLimb;
    const unaffectedArmLength = document.getElementById("unaffectedArm");
    const affectedArmLength = document.getElementById("affectedArm");
    if (!saved || !unaffectedArmLength || !affectedArmLength) return;

    if (saved.unaffectedArm !== null) {
      unaffectedArmLength.value = saved.unaffectedArm;
    }
    if (saved.affectedArm !== null) {
      affectedArmLength.value = saved.affectedArm;
    }
  }
  if (id === "shorteningLowerLimb") {
    const saved = tempData.measures?.LegLengthDifference?.shorteningLowerLimb;
    const unaffectedArmLength = document.getElementById("unaffectedLimb");
    const affectedArmLength = document.getElementById("affectedLimb");
    if (!saved || !unaffectedArmLength || !affectedArmLength) return;

    if (saved.unaffectedLimb !== null) {
      unaffectedArmLength.value = saved.unaffectedLimb;
    }
    if (saved.affectedLimb !== null) {
      affectedArmLength.value = saved.affectedLimb;
    }
  }
  if (id === "lossMpOneUpperLimb" || id === "lossMpOneOrBothLowerLimb") {
    restoreMusclePowerSection(id);
  }
  cardSections = [
    "amputationOneUpperLimb",
    "amputationBothUpperLimb",
    "amputationLowerLimb",
    "amputationUpperLowerLimb",
    "promShoulder",
    "promElbowOneSide",
    "promWristOneSide",
    "promFingers",
    "promHip",
    "promKneeOneSide",
    "promAnkle",
    "CpIsra",
  ];

  if (cardSections.includes(id)) {
    restoreAllCardsSections(id); //for the sections which is selected by user's decision excluded calculation based sections
  }
}
function restoreAllCardsSections(sectionKey) {
  const sectionElement = document.getElementById(sectionKey);
  if (!sectionElement) return;
  const savedClass = tempData.selectedClass; //this value putted here once.
  if (!savedClass) return;
  const sectionCards = sectionElement.querySelectorAll(".card");
  sectionCards.forEach((card) => {
    if (card.getAttribute("cardValue") === savedClass) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
}
//FOR THE SECTION: MUSCLE POWER LOSS
function manageMusclePowerLogic() {
  const section = document.getElementById("lossMpOneUpperLimb");
  if (!section) return;

  // choosing all right and left inputs into the variable
  const allLeftInputs = document.querySelectorAll(
    'input[name*="shoulder"][name*="_str_L"], input[name*="elbow"][name*="_str_L"], input[name*="foreArm"][name*="_str_L"], input[name*="wrist"][name*="_str_L"], input[name*="finger"][name*="_str_L"], input[name*="thumb"][name*="_str_L"]',
  );
  const allRightInputs = document.querySelectorAll(
    'input[name*="shoulder"][name*="_str_R"], input[name*="elbow"][name*="_str_R"], input[name*="foreArm"][name*="_str_R"], input[name*="wrist"][name*="_str_R"], input[name*="finger"][name*="_str_R"], input[name*="thumb"][name*="_str_R"]',
  );

  // For setting Mobile and desktop uı for muscle power loss

  // First choosing all inputs
  const allInputs = document.querySelectorAll(
    'input[name*="_str_"], input[name*="_prom_"]',
  );

  allInputs.forEach((input) => {
    //
    if (!input.hasAttribute("data-listener")) {
      input.setAttribute("data-listener", "true");

      input.addEventListener("input", function (e) {
        const val = e.target.value;
        const name = e.target.name; //finding html element name,we will find mob/desktop version

        //finding other version and make same value for both of them
        document.querySelectorAll(`input[name="${name}"]`).forEach((twin) => {
          if (twin !== e.target) twin.value = val;
        });

        //if it is upperlimb strength apply the function
        if (section.contains(e.target) && name.includes("_str_")) {
          applyGlobalSideLock(allLeftInputs, allRightInputs);
        }
      });
    }
  });

  //
  applyGlobalSideLock(allLeftInputs, allRightInputs);
}

//for upper limb only one side mp loss is calculated
function applyGlobalSideLock(leftInputs, rightInputs) {
  let isLeftFilled = Array.from(leftInputs).some((i) => i.value.trim() !== "");

  let isRightFilled = Array.from(rightInputs).some(
    (i) => i.value.trim() !== "",
  );

  //if right input is filled make gray left inputs
  rightInputs.forEach((inp) => {
    if (isLeftFilled) {
      inp.value = "";
      inp.disabled = true;
      inp.classList.add("offline", "bg-gray-100", "cursor-not-allowed");
      if (typeof clearErrorMsg === "function") clearErrorMsg(inp);

      // make offline other sided too (desktop-mobil)
      document.querySelectorAll(`input[name="${inp.name}"]`).forEach((t) => {
        t.value = "";
        t.disabled = true;
        t.classList.add("offline");
      });
    } else {
      // if both sides are empty open all inputs (left,right)
      if (!isRightFilled) {
        inp.disabled = false;
        inp.classList.remove("offline", "bg-gray-100", "cursor-not-allowed");
        //
        document.querySelectorAll(`input[name="${inp.name}"]`).forEach((t) => {
          t.disabled = false;
          t.classList.remove("offline");
        });
      }
    }
  });

  leftInputs.forEach((inp) => {
    if (isRightFilled) {
      inp.value = "";
      inp.disabled = true;
      inp.classList.add("offline", "bg-gray-100", "cursor-not-allowed");
      if (typeof clearErrorMsg === "function") clearErrorMsg(inp);

      document.querySelectorAll(`input[name="${inp.name}"]`).forEach((t) => {
        t.value = "";
        t.disabled = true;
        t.classList.add("offline");
      });
    } else {
      if (!isLeftFilled) {
        inp.disabled = false;
        inp.classList.remove("offline", "bg-gray-100", "cursor-not-allowed");
        document.querySelectorAll(`input[name="${inp.name}"]`).forEach((t) => {
          t.disabled = false;
          t.classList.remove("offline");
        });
      }
    }
  });
}

// 3. RESTORE (when you click Go Back Edit it distribute the data)
function restoreMusclePowerSection(sectionId) {
  const savedData = tempData.measures?.ImpairedMusclePower?.[sectionId];
  if (!savedData) return;

  Object.keys(savedData).forEach((key) => {
    const inputs = document.querySelectorAll(`input[name="${key}"]`);
    inputs.forEach((inp) => {
      let rawValue = savedData[key];

      // the value should be 0-5
      if (key.includes("_str_")) {
        let numericVal = parseInt(rawValue);

        if (numericVal > 5) numericVal = 5;
        if (numericVal < 0) numericVal = 0;

        rawValue = isNaN(numericVal) ? "" : numericVal.toString();
      }

      inp.value = rawValue;
    });
  });

  if (sectionId === "lossMpOneUpperLimb") {
    manageMusclePowerLogic();
  }
}

// ==========================
// 5) STEP & NAVIGATION FUNCTIONS
// ==========================

function nextStep() {
  //saving personal info to permanent obj
  tempData.personal.familyName = document.getElementById("family-name").value;
  tempData.personal.givenName = document.getElementById("given-name").value;
  tempData.personal.dateOfBirth =
    document.getElementById("date-of-birth").value;
  tempData.personal.teamName = document.getElementById("team-name").value;
  tempData.personal.eventName = document.getElementById("event-name").value;
  tempData.personal.classificationDate = document.getElementById(
    "date-of-classification",
  ).value;

  const inputs = document
    .getElementById("step-1")
    .querySelectorAll("input, select");

  inputs.forEach((input) => {
    if (input.type === "radio" && input.checked) {
      tempData.personal.eventStatus = input.value;
    } else {
      return;
    }
  });

  //stepping forward
  document.getElementById("step-1").style.display = "none";
  document.getElementById("step-2").style.display = "block";
  const allSections = document.querySelectorAll(".result-section");
  allSections.forEach((sec) => {
    sec.classList.add("hidden");
    sec.style.display = "";
  });
}

function updateModels() {
  const spesificImpairmentSelect =
    document.getElementById("spesificImpairment");
  spesificImpairmentSelect.innerHTML = "";
  const selectedImpairmentType = impairmentTypeSelect.value;

  if (selectedImpairmentType === "0") {
    const newOption = document.createElement("option");
    newOption.textContent = "First select impairment type";
    newOption.value = "0";
    spesificImpairmentSelect.appendChild(newOption);
    return;
  }
  const subData = impairmentTypes[selectedImpairmentType].spesificImpairments;
  for (let key in subData) {
    const newOption = document.createElement("option");
    newOption.value = key;
    newOption.textContent = subData[key].label;
    spesificImpairmentSelect.appendChild(newOption);
  }
}

function nextStep2() {
  //saving general health info
  tempData.generalHealthInfo = {
    underlyingHealthCondition: document
      .getElementById("underlyingHealthCondition")
      .value.trim(),
    supportiveEvidence: document
      .getElementById("supportiveEvidence")
      .value.trim(),
    missingDoc: document.getElementById("missingDoc").value.trim(),
  };

  //choosing impairment type for assessment
  const selectedImpairmentType = impairmentTypeSelect.value;
  const selectedspesificImpairment =
    document.getElementById("spesificImpairment").value;

  if (selectedImpairmentType === "0" || selectedspesificImpairment === "0") {
    alert("Please make a selection");
    return;
  }

  const selectedspesificImpairmentId =
    impairmentTypes[selectedImpairmentType].spesificImpairments[
      selectedspesificImpairment
    ];

  if (selectedspesificImpairmentId && selectedspesificImpairmentId.sectionId) {
    showSection(selectedspesificImpairmentId.sectionId);
  }
  const selectedImpairmentTypeLabel =
    impairmentTypes[selectedImpairmentType].label;
  const selectedspesificImpairmentLabel = selectedspesificImpairmentId.label;
  //saving selected impairment type and spesific impairment type to template object

  tempData.impairmentType = selectedImpairmentType;
  tempData.spesificImpairment = selectedspesificImpairment;
  tempData.sectionId = selectedspesificImpairmentId.sectionId;
  tempData.impairmentTypeLabel = selectedImpairmentTypeLabel;
  tempData.spesificImpairmentLabel = selectedspesificImpairmentLabel;

  showSection(selectedspesificImpairmentId.sectionId);
  updateStep2Buttons();
}

//showing section part according to selection
function showSection(id) {
  const allSections = document.querySelectorAll(".result-section");
  allSections.forEach((sec) => {
    sec.classList.add("hidden");
    sec.style.display = "";
  });

  const targetSection = document.getElementById(id);
  const completedBtn = document.getElementById("btnCompleted");
  if (targetSection) {
    targetSection.classList.remove("hidden");
    completedBtn.hidden = false;
    completedBtn.classList.remove("hidden");
    restoreSection(id);
  } else {
    console.error("Section bulunamadı:", id);
  }
}

function nextStep3() {
  document.getElementById("step-2").style.display = "none";
  document.getElementById("step-3").style.display = "block";

  document.getElementById("resName").textContent =
    `${tempData.personal.givenName} ${tempData.personal.familyName}`;
  document.getElementById("resDob").textContent = tempData.personal.dateOfBirth;
  document.getElementById("resTeam").textContent = tempData.personal.teamName;
  document.getElementById("resEvent").textContent =
    `${tempData.personal.eventName} (${tempData.personal.eventStatus})`;
  document.getElementById("resDateClassification").textContent =
    tempData.personal.classificationDate;

  document.getElementById("resCondition").textContent =
    tempData.generalHealthInfo.underlyingHealthCondition;
  document.getElementById("resEvidence").textContent =
    tempData.generalHealthInfo.supportiveEvidence;
  document.getElementById("resMissingEvidence").textContent =
    tempData.generalHealthInfo.missingDoc;
  document.getElementById("resImpType").textContent =
    tempData.impairmentTypeLabel;
  document.getElementById("resSpecific").textContent =
    tempData.spesificImpairmentLabel;
  document.getElementById("resNotes").textContent = tempData.notes;
  document.getElementById("resDecision").textContent =
    tempData.selectedClass.toUpperCase();
}

// ==========================
// 6) MUSCLE POWER section's PROM limiter warning
// ==========================

//for comparing normal ROM values with input values
function getNormalRom(keyMovement) {
  if (normalLowerLimbROMValues[keyMovement] !== undefined) {
    return normalLowerLimbROMValues[keyMovement];
  } else if (normalUpperLimbRomValues[keyMovement] !== undefined) {
    return normalUpperLimbRomValues[keyMovement];
  }
  return null;
}

//for filling default ROM values to empty inputs it wont show warning messages if all proms are normal user doesnt need to fill all inputs
function fillDefaultROM(valuesObject) {
  for (let key in valuesObject) {
    const inputs = document.querySelectorAll(`input[name^="${key}_prom_"]`);
    inputs.forEach((input) => {
      if (input.value === "") {
        input.value = valuesObject[key];
      }
    });
  }
}

function setError(input, message) {
  const errorEl = input.parentElement.querySelector(".prom-error");
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
  input.classList.add("border-red-500");
}

function clearError(input) {
  const errorEl = input.parentElement.querySelector(".prom-error");
  if (!errorEl) return;
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
  input.classList.remove("border-red-500");
}

function setWarning(button, message) {
  button.hidden = false;
  let tooltip = button.nextElementSibling;
  if (!tooltip || !tooltip.classList.contains("prom-tooltip")) {
    tooltip = document.createElement("div");
    tooltip.className =
      "prom-tooltip absolute z-50 p-3 bg-white border border-orange-200 shadow-2xl rounded-xl text-[11px] font-bold text-orange-600 w-48 mt-2";
    button.after(tooltip);
  }
  tooltip.textContent = message;
}

function adjustRomMusclePower(input, normalValue) {
  const warningEl = input.parentElement.querySelector(".prom-warning");
  if (!warningEl) return;

  clearError(input);
  warningEl.hidden = true;

  const value = parseFloat(input.value);
  if (input.value === "" || isNaN(value)) return;

  if (value > normalValue) {
    setError(input, "Value cannot exceed normal ROM");
    return;
  }

  if (value < 0) {
    setError(input, "Value cannot be negative");
    return;
  }

  if (value === normalValue) return;

  const ratio = value / normalValue;

  if (ratio >= 0.75) {
    setWarning(
      warningEl,
      `PROM reduced (${Math.round(
        ratio * 100,
      )}% of normal). Muscle grade given`,
    );
  } else if (ratio >= 0.5 && ratio < 0.75) {
    setWarning(
      warningEl,
      `PROM reduced (${Math.round(
        ratio * 100,
      )}% of normal). Muscle grade minus 1 point.`,
    );
  } else if (ratio >= 0.25 && ratio < 0.5) {
    setWarning(
      warningEl,
      `PROM reduced (${Math.round(
        ratio * 100,
      )}% of normal). Muscle grade minus 2 points`,
    );
  } else if (ratio >= 0 && ratio < 0.25) {
    setWarning(
      warningEl,
      `PROM reduced (${Math.round(
        ratio * 100,
      )}% of normal). Muscle grade minus 3 points`,
    );
  }
}

//Validation for muscle points

function limitMusclePoint(sectionEl) {
  if (!sectionEl) return;

  sectionEl.addEventListener("input", function (e) {
    const input = e.target;

    // only strength input
    if (!input.name || !input.name.includes("_str_")) return;

    // if it is already disabled dont show error
    if (input.disabled) {
      clearErrorMsg(input);
      return;
    }

    const raw = input.value.trim();

    // 1) if its empty
    if (raw === "") {
      clearErrorMsg(input);
      saveMusclePowerPoints(sectionEl.id);
      return;
    }

    // 2) saif it is not number
    let pointvalue = Number(raw);
    if (!Number.isInteger(pointvalue)) {
      showErrorMsg(input, "Please enter a whole number between 0 and 5.");
      return; //if it is empty show error
    }

    // 3) make str 5 max.
    if (pointvalue > 5) {
      input.value = 5;
      pointvalue = 5;
      showErrorMsg(input, "According to MRC Scale, maximum grade is 5.");
      saveMusclePowerPoints(sectionEl.id);
      return;
    } else if (pointvalue < 0) {
      input.value = 0;
      pointvalue = 0;
      showErrorMsg(input, "According to MRC Scale, minimum grade is 0.");
      saveMusclePowerPoints(sectionEl.id);
      return;
    } else {
      clearErrorMsg(input);
      saveMusclePowerPoints(sectionEl.id);
    }
  });
}

function getErrorEl(input) {
  // if you find p element right after input
  const p = input.nextElementSibling;
  if (p && p.classList.contains("input-error")) return p;
  return null;
}

function showErrorMsg(input, message) {
  const p = getErrorEl(input);
  if (!p) return;
  p.textContent = message;
  p.classList.remove("hidden");
  p.className =
    "input-error text-red-500 font-bold text-[10px] uppercase tracking-wider mt-1 ml-2";
  input.setAttribute("aria-invalid", "true");

  if (p.removeTimer) {
    clearTimeout(p.removeTimer);
  }

  p.removeTimer = setTimeout(() => {
    clearErrorMsg(input);
  }, 2000); //remove error message after 2000ms
}

function clearErrorMsg(input) {
  const p = getErrorEl(input);
  if (!p) return;
  p.textContent = "";
  p.classList.add("hidden");
  input.classList.remove("invalid");
  input.setAttribute("aria-invalid", "false");
}

function isStrengthSectionValid(sectionEl) {
  const inputs = sectionEl.querySelectorAll('input[name*="_str_"]');
  for (const inp of inputs) {
    if (inp.disabled) continue;
    const raw = inp.value.trim();
    if (raw === "") return false;
    const n = Number(raw);
    if (!Number.isInteger(n)) return false;
    if (n < 0 || n > 5) return false;
  }
  return true;
}

//upper limb muscle power loss part- for making disable one side

function getMusclePowerPoints(targetSectionId) {
  const safeContainer = document.getElementById(targetSectionId);
  if (!safeContainer) return 0;

  const allInputs = safeContainer.querySelectorAll('input[name*="_str_"]');
  let totalPoints = 0;
  let hasValue = false;
  const processedNames = new Set();

  allInputs.forEach((item) => {
    if (
      !item.disabled &&
      item.value.trim() !== "" &&
      !processedNames.has(item.name)
    ) {
      let value = parseInt(item.value);

      if (value > 5) value = 5;
      if (value < 0) value = 0;

      if (!isNaN(value)) {
        totalPoints += value;
        hasValue = true;
        processedNames.add(item.name);
      }
    }
  });

  if (!hasValue) return 0;

  const maxPossible = targetSectionId.includes("Lower") ? 80 : 70;
  const loss = maxPossible - totalPoints;

  console.log(
    ` ${targetSectionId} | Sum of points: ${totalPoints} | loss: ${loss}`,
  );
  return loss;
}

function getClassUpperLimbMusclePowerPoints(loss) {
  if (loss >= 25) {
    return "vs1";
  } else if (loss >= 15 && loss <= 24) {
    return "vs2";
  } else {
    return "ne";
  }
}

function getClassLowerLimbMpLoss(loss) {
  if (loss >= 16) {
    return "vs1"; //disabled class for sitting volleyball (In Sitting Volleyball, a team consists of 6 players on the court. According to the rules, only one VS2 player is allowed on the court at any time; the rest must be VS1.So thats why we need to classify athletes. By limiting VS2 participation, the rules provide a fair platform for those with greater physical challenges. It prevents teams from relying solely on players with higher mobility, ensuring that Sitting Volleyball remains an inclusive and balanced sport where VS1 athletes—the core of the discipline—can truly shine and compete on equal terms.)
  } else if (loss >= 7 && loss <= 15) {
    return "vs2"; // Minimal Disability
  } else {
    return "ne"; // the athlete is not disabled enough for playing sitting volleyball
  }
}
function showMPLossCard(cardValue) {
  const mpLowerLimbLossCards = document.querySelectorAll(
    "#optionMPLLowerLimbLossCards .MPLossCard",
  );
  const mpUpperLimbLossCards = document.querySelectorAll(
    "#optionUpperLimbMPLossCards .UpperLimbMPLossCard",
  );

  if (mpLowerLimbLossCards.length > 0) {
    mpLowerLimbLossCards.forEach((card) => {
      const cardValueclass = card.getAttribute("cardValue");
      card.classList.toggle("hidden", cardValueclass !== cardValue);
    });
  }
  if (mpUpperLimbLossCards.length > 0) {
    mpUpperLimbLossCards.forEach((card) => {
      const cardValueclass = card.getAttribute("cardValue");
      card.classList.toggle("hidden", cardValueclass !== cardValue);
    });
  }
}

function saveMusclePowerPoints(sectionId) {
  const sectionName = document.getElementById(sectionId);
  if (!sectionName) return;

  const inputs = sectionName.querySelectorAll(
    'input[name*="_str_"],input[name*="_prom_"]',
  );

  tempData.measures ||= {};
  tempData.measures.ImpairedMusclePower ||= {};
  tempData.measures.ImpairedMusclePower[sectionId] ||= {};

  const store = tempData.measures.ImpairedMusclePower[sectionId];
  inputs.forEach((inp) => {
    // offline/disabled olanları kaydetme
    if (inp.disabled) return;
    store[inp.name] = inp.value;
  });
}

function validateSectionBeforeCalc(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) {
    console.log("bulunamadı o segment");
    return false;
  }
  const inputs = section.querySelectorAll(
    `input[name*="_str_"]:not(:disabled)`,
  ); //do not choose disabled ones

  let isValid = true;
  let filledCount = 0;

  //
  inputs.forEach((input) => {
    if (input.value.trim() !== "") {
      filledCount++;
    }
  });

  if (filledCount === 0) {
    alert("Please fill at least one side before calculating.");
    return false;
  }

  // find if it is empty
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      showErrorMsg(input, "Required");
      isValid = false;
    } else {
      clearErrorMsg(input);
    }
  });

  return isValid;
}

// ==========================
// 7) EVENT LISTENERS (NO CHANGE, ONLY ORDERED)
// ==========================

// Fill default ROM + MP input limiters + UL one side selection
document.addEventListener("DOMContentLoaded", () => {
  fillDefaultROM(normalUpperLimbRomValues);
  fillDefaultROM(normalLowerLimbROMValues);

  manageMusclePowerLogic();

  limitMusclePoint(sectionMpLowerLimbLoss);
  limitMusclePoint(sectionMpUpperLimbLoss);
});

// Card click selection (only visible section)
document.addEventListener("click", function (e) {
  const card = e.target.closest(".card");
  if (!card) return;

  const section = card.closest(".result-section");
  if (!section || section.classList.contains("hidden")) return;

  section.querySelectorAll(".card").forEach((c) => {
    c.classList.remove("selected");
  });
  card.classList.add("selected");

  const val = card.getAttribute("cardValue");
  console.log(`The selection ${val}`);
  tempData.selectedClass = val;
  updateStep2Buttons();
});

// Notes
document.addEventListener("input", function (e) {
  if (e.target.classList.contains("classifierNotes")) {
    tempData.notes = e.target.value;
    console.log("classifiers comments", tempData.notes);
  }
});

// PROM changes
document.addEventListener("input", function (e) {
  const input = e.target;
  if (!input.name.includes("prom_")) {
    return;
  }
  const keyMovement = input.name.split("_prom_")[0];
  const normalValueROM = getNormalRom(keyMovement);

  if (!normalValueROM) {
    return;
  }
  adjustRomMusclePower(input, normalValueROM);
});

// Warning tooltip toggles
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".prom-warning");

  // Diğer tüm tooltipleri kapat
  document.querySelectorAll(".prom-tooltip").forEach((t) => {
    if (!btn || t.previousElementSibling !== btn) {
      t.style.display = "none";
    }
  });

  if (!btn) return;

  const tooltip = btn.nextElementSibling;
  if (tooltip) {
    tooltip.style.display =
      tooltip.style.display === "block" ? "none" : "block";
  }
});

// Muscle Power Loss calculation buttons
// Muscle Power Loss calculation buttons
const calcLowerLimbLossMPBtn = document.getElementById(
  "calculateLowerLimbLossMusclePowerPointsBtn",
);
const calcUpperLimbLossMPBtn = document.getElementById(
  "calculateUpperLimbLossMusclePowerPointsBtn",
);

// 1. ÜST EKSTREMİTE (UPPER LIMB) HESAPLAMA BUTONU
if (calcUpperLimbLossMPBtn) {
  calcUpperLimbLossMPBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Hangi bölümün hesaplanacağını değişkene atıyoruz
    const targetID = "lossMpOneUpperLimb";

    if (validateSectionBeforeCalc(targetID)) {
      const loss = getMusclePowerPoints(targetID);

      const selectedCard = getClassUpperLimbMusclePowerPoints(loss);
      showMPLossCard(selectedCard);
      tempData.selectedClass = selectedCard;
      updateStep2Buttons();

      console.log("Upper Limb loss:", loss, "decision:", selectedCard);
    }
  });
}

if (calcLowerLimbLossMPBtn) {
  calcLowerLimbLossMPBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const targetID = "lossMpOneOrBothLowerLimb";

    if (validateSectionBeforeCalc(targetID)) {
      const loss = getMusclePowerPoints(targetID);

      const selectedCard = getClassLowerLimbMpLoss(loss);

      showMPLossCard(selectedCard);
      tempData.selectedClass = selectedCard;
      updateStep2Buttons();

      console.log("Lower Limb Kayıp:", loss, "Karar:", selectedCard);
    }
  });
}

// ==========================
// 8) AMPUTATION / DISMELIA / LLD CALCULATORS (NO CHANGE)
// ==========================

// AMPUTATION DISMELIA ----Dismelia Upper Limb
const calculateBtn = document.getElementById("calcDismeliaBtn");
if (calculateBtn) {
  const unaffectedArmLength = document.getElementById("unaffectedArm");
  const affectedArmLength = document.getElementById("affectedArm");
  let armCalcResult = document.querySelector(
    "#dismeliaUpperLimb .calculation-result",
  );
  const maxArmLength = 150;

  calculateBtn.addEventListener("click", function (e) {
    e.preventDefault();
    armCalcResult.innerHTML = "";
    const useUnaffected = parseFloat(unaffectedArmLength.value);
    const useAffected = parseFloat(affectedArmLength.value);
    //we only check inputs after clicking the calculate btn since we declared this will be number as doing type number.
    if (
      isNaN(useUnaffected) ||
      isNaN(useAffected) ||
      useUnaffected <= 0 ||
      useAffected <= 0
    ) {
      armCalcResult.textContent = "Please enter valid values for both fields";
      return;
    }

    if (
      useUnaffected === useAffected ||
      useUnaffected === 0 ||
      useAffected === 0 ||
      useUnaffected < useAffected ||
      useUnaffected > maxArmLength ||
      useAffected > maxArmLength
    ) {
      armCalcResult.textContent = "Please enter a valid value for both fields";
      return;
    }

    const resultBox = document.createElement("div");
    const resultheading = document.createElement("h2");
    const resultComment = document.createElement("p");

    const Calclogic = ((useUnaffected - useAffected) / useUnaffected) * 100;
    const formattedResult = Calclogic.toFixed(2);

    resultComment.textContent = `The athlete's length of affected arm is ${formattedResult}% shorter than the unaffected arm.`;

    resultBox.setAttribute(
      "class",
      "md:flex-1 p-6  rounded-2xl shadow-xl border-[#00AEEF] bg-[#00AEEF]/10 transition-all duration-300 cursor-pointer flex flex-col justify-between",
    );

    resultheading.setAttribute("class", "text-xl font-extrabold tracking-wide");

    if (Calclogic < 25) {
      resultheading.textContent = "NON ELIGIBLE";
      tempData.selectedClass = "ne";
    } else if (Calclogic >= 25 && Calclogic < 32) {
      resultheading.textContent = "VS2";
      tempData.selectedClass = "vs2";
    } else {
      resultheading.textContent = "VS1";
      tempData.selectedClass = "vs1";
    }

    resultBox.appendChild(resultheading);
    resultBox.appendChild(resultComment);
    armCalcResult.appendChild(resultBox);
    tempData.selectedClass = resultheading.textContent;
    updateStep2Buttons();
  });
}

function saveDismeliaInputs() {
  const unaffectedArmLength = document.getElementById("unaffectedArm");
  const affectedArmLength = document.getElementById("affectedArm");
  if (!unaffectedArmLength || !affectedArmLength) return;

  tempData.measures ||= {}; //to protected faced with undefined attention ı used this
  tempData.measures.AmputationDismelia ||= {};
  tempData.measures.AmputationDismelia.dismeliaUpperLimb ||= {};

  tempData.measures.AmputationDismelia.dismeliaUpperLimb.unaffectedArm =
    unaffectedArmLength.value;
  tempData.measures.AmputationDismelia.dismeliaUpperLimb.affectedArm =
    affectedArmLength.value;
}

document.addEventListener("input", (e) => {
  if (e.target.id === "unaffectedArm" || e.target.id === "affectedArm") {
    saveDismeliaInputs();
  }
});

// LEG LENGTH DIFFERENCE --- Shortening Lower Limb
const calcShorteningLowerLimbBtn = document.getElementById(
  "calcShorteningLowerLimbBtn",
);
if (calcShorteningLowerLimbBtn) {
  const unaffectedLimbLength = document.getElementById("unaffectedLimb");
  const affectedLimbLength = document.getElementById("affectedLimb");
  let lowerLimbCalcResult = document.querySelector(
    ".calculation-result-shortlimb",
  );
  const maxLowerLimbLength = 200;

  calcShorteningLowerLimbBtn.addEventListener("click", function (e) {
    e.preventDefault();
    lowerLimbCalcResult.innerHTML = "";
    const useUnaffected = parseFloat(unaffectedLimbLength.value);
    const useAffected = parseFloat(affectedLimbLength.value);

    if (
      isNaN(useUnaffected) ||
      isNaN(useAffected) ||
      useUnaffected <= 0 ||
      useAffected <= 0
    ) {
      lowerLimbCalcResult.textContent =
        "Please enter valid values for both fields";
      return;
    }

    if (
      useUnaffected === useAffected ||
      useUnaffected === 0 ||
      useAffected === 0 ||
      useUnaffected < useAffected ||
      useUnaffected > maxLowerLimbLength ||
      useAffected > maxLowerLimbLength
    ) {
      lowerLimbCalcResult.textContent =
        "Please enter a valid value for both fields";
      return;
    }

    const resultBox = document.createElement("div");
    const resultheading = document.createElement("h2");
    const resultComment = document.createElement("p");

    const Calclogic = ((useUnaffected - useAffected) / useUnaffected) * 100;
    const formattedResult = Calclogic.toFixed(2);

    resultComment.textContent = `The athlete's length of affected lower limb is ${formattedResult}% shorter than the unaffected limb.`;

    resultBox.setAttribute(
      "class",
      "md:flex-1 p-6  rounded-2xl shadow-xl border-[#00AEEF] bg-[#00AEEF]/10 transition-all duration-300 cursor-pointer flex flex-col justify-between",
    );

    resultheading.setAttribute("class", "text-xl font-extrabold tracking-wide");
    if (Calclogic < 7) {
      resultheading.textContent = "NON ELIGIBLE";
      tempData.selectedClass = "ne";
    } else if (Calclogic >= 7 && Calclogic <= 32) {
      resultheading.textContent = "VS2";
      tempData.selectedClass = "vs2";
    } else {
      resultheading.textContent = "VS1";
      tempData.selectedClass = "vs1";
    }

    resultBox.appendChild(resultheading);
    resultBox.appendChild(resultComment);
    lowerLimbCalcResult.appendChild(resultBox);
    //tempData.selectedClass = resultheading.textContent;
    updateStep2Buttons();
  });
}

function saveShortLegLengthInputs() {
  const unaffectedLimbLength = document.getElementById("unaffectedLimb");
  const affectedLimbLength = document.getElementById("affectedLimb");
  if (!unaffectedLimbLength || !affectedLimbLength) return;

  tempData.measures ||= {}; //to protected faced with undefined attention ı used this
  tempData.measures.LegLengthDifference ||= {};
  tempData.measures.LegLengthDifference.shorteningLowerLimb ||= {};

  tempData.measures.LegLengthDifference.shorteningLowerLimb.unaffectedLimb =
    unaffectedLimbLength.value;
  tempData.measures.LegLengthDifference.shorteningLowerLimb.affectedLimb =
    affectedLimbLength.value;
}

document.addEventListener("input", (e) => {
  if (e.target.id === "unaffectedLimb" || e.target.id === "affectedLimb") {
    saveShortLegLengthInputs();
  }
});

// ==========================
// 9) PREV / FINALIZE
// ==========================

function prevStep(targetNum) {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  step1.style.display = "none";
  step2.style.display = "none";
  step3.style.display = "none";

  if (targetNum === 1) {
    step1.style.display = "block";
  } else if (targetNum === 2) {
    step2.style.display = "block";
    if (tempData.sectionId) {
      showSection(tempData.sectionId);
    }
  }
  // Step2 UI refresh
  validationStep2Base();
  updateStep2Buttons();
}

function finalize(e) {
  if (e) {
    e.preventDefault();
  }
  if (!tempData.selectedClass) {
    alert("Please select a classification decision before saving.");
    return;
  }
  //const finalRecord = JSON.parse(JSON.stringify(tempData)); //saving the last status of the athletes permanent stiuation
  const package = JSON.stringify(tempData);
  localStorage.setItem("athleteReport", package);
  // sessionStorage.removeItem("draftSession");
  window.location.replace("report.html");
}

// ==========================
// 10) LOCALSTORAGE RESTORE + MP SAVE LISTENERS (NO CHANGE)
// ==========================

/* If localstorage has some info; */
document.addEventListener("DOMContentLoaded", () => {
  const hasSession = sessionStorage.getItem("draftSession") === "1";
  if (!hasSession) {
    localStorage.removeItem("athleteReport");
    sessionStorage.setItem("draftSession", "1");
  }
  const storedData = localStorage.getItem("athleteReport");
  if (storedData) {
    const savedRecord = JSON.parse(storedData);
    tempData = savedRecord;

    document.getElementById("family-name").value =
      savedRecord.personal.familyName;
    document.getElementById("given-name").value =
      savedRecord.personal.givenName;
    document.getElementById("date-of-birth").value =
      savedRecord.personal.dateOfBirth;
    document.getElementById("team-name").value = savedRecord.personal.teamName;

    if (savedRecord.personal.flagUrl) {
      const findflagContainer = document.getElementById("flag");
      if (findflagContainer) {
        findflagContainer.innerHTML = `<img src="${savedRecord.personal.flagUrl}" alt="Flag of ${savedRecord.personal.teamName}" class="h-48 w-52  object-contain drop-shadow-lg">`;
      }
    }
    document.getElementById("event-name").value =
      savedRecord.personal.eventName;
    document.getElementById("date-of-classification").value =
      savedRecord.personal.classificationDate;

    if (savedRecord.personal.eventStatus) {
      const radioBtn = document.querySelector(
        `input[name="event-status"][value="${savedRecord.personal.eventStatus}"]`,
      );
      if (radioBtn) radioBtn.checked = true;
    }

    if (savedRecord.generalHealthInfo) {
      document.getElementById("underlyingHealthCondition").value =
        savedRecord.generalHealthInfo.underlyingHealthCondition;
      document.getElementById("supportiveEvidence").value =
        savedRecord.generalHealthInfo.supportiveEvidence;
      document.getElementById("missingDoc").value =
        savedRecord.generalHealthInfo.missingDoc;
    }

    if (savedRecord.impairmentType && savedRecord.impairmentType !== "0") {
      impairmentTypeSelect.value = savedRecord.impairmentType;

      updateModels();

      const specificSelect = document.getElementById("spesificImpairment");
      if (savedRecord.spesificImpairment) {
        specificSelect.value = savedRecord.spesificImpairment;

        if (savedRecord.sectionId) {
          showSection(savedRecord.sectionId);
        }
      }
    }

    if (savedRecord.notes) {
      const noteAreas = document.querySelectorAll(".classifierNotes");
      noteAreas.forEach((area) => {
        area.value = savedRecord.notes;
      });
    }

    if (savedRecord.measures && savedRecord.measures.ImpairedMusclePower) {
      if (savedRecord.measures.ImpairedMusclePower.lossMpOneUpperLimb) {
        restoreMusclePowerSection("lossMpOneUpperLimb");
      }

      if (savedRecord.measures.ImpairedMusclePower.lossMpOneOrBothLowerLimb) {
        restoreMusclePowerSection("lossMpOneOrBothLowerLimb");
      }
    }
  }

  if (sectionMpUpperLimbLoss) {
    sectionMpUpperLimbLoss.addEventListener("input", () => {
      saveMusclePowerPoints("lossMpOneUpperLimb");

      // updateStep2Buttons();
    });
  }

  if (sectionMpLowerLimbLoss) {
    sectionMpLowerLimbLoss.addEventListener("input", () => {
      saveMusclePowerPoints("lossMpOneOrBothLowerLimb");
      // updateStep2Buttons();
    });
  }

  validateStep1();
  validationStep2Base();
  updateStep2Buttons();
});
document.addEventListener("DOMContentLoaded", () => {
  const selectEl = document.getElementById("team-name");
  async function fetchFlags() {
    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags",
      );
      const posts = await response.json();
      posts.sort((a, b) => a.name.common.localeCompare(b.name.common)); //for alphabetical que

      posts.forEach((post) => {
        const option = document.createElement("option");
        option.textContent = post.name.common;
        option.setAttribute("data-flag", post.flags.svg);
        selectEl.appendChild(option);
      });
      //for selecting team name whrn user comes back
      const storedData = localStorage.getItem("athleteReport");
      if (storedData) {
        const savedRecord = JSON.parse(storedData);
        if (savedRecord.personal.teamName) {
          selectEl.value = savedRecord.personal.teamName;
        }
        validateStep1();
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchFlags();
  const findflagContainer = document.getElementById("flagBox");

  selectEl.addEventListener("change", () => {
    let selectedOption = selectEl.options[selectEl.selectedIndex];
    let findSvg = selectedOption.getAttribute("data-flag");
    findflagContainer.innerHTML = `<img src="${findSvg}" alt="Flag" class="h-full w-full object-cover rounded-2xl">`;
    tempData.personal.teamName = selectedOption.value;
    tempData.personal.flagUrl = findSvg;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btnBackToStep1 = document.getElementById("btnBackToStep1");
  if (btnBackToStep1) {
    btnBackToStep1.addEventListener("click", () => {
      prevStep(1);
    });
  }
  const viewLogicBtn = document.getElementById("viewLogicBtn");
  if (viewLogicBtn) {
    viewLogicBtn.addEventListener("click", () => {
      nextStep2();
    });
  }
  const btnEditAssessment = document.getElementById("btnEditAssessment");
  if (btnEditAssessment) {
    btnEditAssessment.addEventListener("click", () => prevStep(2));
  }
  const btnCompleted = document.getElementById("btnCompleted");
  if (btnCompleted) {
    btnCompleted.addEventListener("click", () => {
      nextStep3();
    });
  }
  const btnFinalize = document.getElementById("btnFinalize");
  if (btnFinalize) {
    btnFinalize.addEventListener("click", finalize);
  }
});
