const DATA = {
  "Campaign Manager": {
    "Pre-Kickoff Support": [
      "Assets review and support before campaign kickoff",
      "Scope and/or complexity assessment ahead of kickoff"
    ],
    "Campaign Management": [
      "Campaign briefing, internal documentation and asset management",
      "Front end support, assets review and feedback management",
      "Consultant support on campaign development processes",
      "Back end support on campaign processes",
      "Review of campaign development progress and overal team coordination and support",
      "UAT support",
      "QA support",
      "Campaign costs review, logs evaluation and optimization processes"
    ],
    "Post-Launch Support": [
      "Campaign costs review, logs evaluation and optimization processes",
    "Ensuring campaign runs correctly + Remarketing launch review"
    ]
  },

  "Front End": {
			 "Pre-Kickoff Support": [
      "Layout mockup development for approval prior to SFMC development"
    ],
  "Coordination": [
    "Support, task coordination & review assets campaign"
  ],

   "Email Layout": [
    "Layout mockup development for approval prior to SFMC development",
    "Initial Layout Development",
    "Email Remarketing Management",
    "Sending email tests to client for content review and approval",
    "Review, addition and finalization of all email and campaign links ahead of campaign UAT processes",
    "Layout adjustments for responsiveness, Outlook compatibility and email client rendering",
    "Implementation of feedback requested by client side on campaign assets"
  ],
  "Simple Survey": [
    "Layout mockup development for approval prior to SFMC development",
    "Layout Development",
    "TYP Development",
    "Design adjustments to improve responsiveness and browser compatibility",
    "Implementation of feedback requested by client side on campaign assets"
  ],
  "Star Rating": [
    "Layout mockup development for approval prior to SFMC development",
    "Layout Development",
    "TYP Development",
    "Design adjustments to improve responsiveness and browser compatibility",
    "Implementation of feedback requested by client side on campaign assets"
  ],
  "Complex Survey": [
    "Layout mockup development for approval prior to SFMC development",
    "Layout Development",
    "TYP Development",
    "Design adjustments to improve responsiveness and browser compatibility",
    "Implementation of feedback requested by client side on campaign assets"
  ],
  "Landing Page": [
    "Layout mockup development for approval prior to SFMC development",
    "Layout Development",
    "Design adjustments to improve responsiveness and browser compatibility",
    "Implementation of feedback requested by client side on campaign assets"
  ]
},
  Consultant: {
    "Campaign Setup": [
      "Campaign development, journey execution and overall setup of functional processes",
      "Campaign scope analysis and solution design"
    ],
    "Data Cloud": ["Data Cloud segment review and activation"],
    "Final Audience": ["Review and signoff on final audience for campaign"],
    "Consent Review": [
      "Review and signoff on specific consents related to the campaign"
    ],
    UAT: ["End to end review of full campaign and User Acceptance Testing"],
    Followup: [
      "Ensuring campaign runs correctly + Remarketing launch review",
      "Stoppage of campaign related processes such as automations and/or cloudpage activity"
    ]
  },
  "Back End": {
    "Simple Survey": [
      "Development of required processes for campaign survey functionalities"
    ],
    "Complex Survey": [
      "Development of required processes for campaign survey functionalities"
    ],
    "Simple Landing": [
      "Development of required processes for campaign survey functionalities"
    ],
    "Complex Landing": [
      "Development of required processes for campaign survey functionalities"
    ],
    "GTW Registration": [
      "Development of required processes for campaign survey functionalities"
    ]
  },
  "Specialist (QA)": {
    QA: [
      "End to end review of full campaign assets and developments for Quality Assurance ahead of campaign launch"
    ]
  }
};
const RECURRENTES = [
  "Email Layout: Development for campaign assets",
  "Internal Meeting: Campaign kickoff",
  "Internal Meeting: Pre-launch meeting",
  "Internal Meeting: Review of front end assets and developer support",
  "Internal Meeting: Review of campaign scope and tech development support",
  "Internal Meeting: Review of back end requirements and developer support"
];
// ── state: array of {tarea, desc} ──
let queue = [];
// ── refs ──
const selRol = document.getElementById("sel-rol");
const selTarea = document.getElementById("sel-tarea");
const selDesc = document.getElementById("sel-desc");
const resultEl = document.getElementById("result-text");
const btnRow = document.getElementById("btn-row");
const badgeOk = document.getElementById("badge-ok");
const btnAdd = document.getElementById("btn-add");
const queueEl = document.getElementById("queue");
// ── recurrentes ──
const recList = document.getElementById("rec-list");
RECURRENTES.forEach((r) => {
  const div = document.createElement("div");
  div.className = "rec-item";
  div.innerHTML = `<span class="rec-tag">Recurrente</span><span class="rec-text">${r}</span><button class="rec-copy" onclick="copyRec(this,'${r.replace(/'/g, "\\'")}')">Copiar</button>`;
  recList.appendChild(div);
});
// ── selector handlers ──
function onRolChange() {
  const rol = selRol.value;
  populate(
    selTarea,
    rol ? Object.keys(DATA[rol]) : [],
    "— Elige una tarea —",
    "— Primero elige un rol —"
  );
  selTarea.disabled = !rol;
  selTarea.className = "";
  populate(selDesc, [], "", "— Primero elige una tarea —");
  selDesc.disabled = true;
  selDesc.className = "";
  btnAdd.disabled = true;
}

function onTareaChange() {
  const rol = selRol.value;
  const tarea = selTarea.value;
  const descs = rol && tarea ? DATA[rol][tarea] || [] : [];
  populate(
    selDesc,
    descs,
    "— Elige una descripción —",
    "— Elige una descripción —"
  );
  selDesc.disabled = descs.length === 0;
  selDesc.className = "";
  selTarea.className = tarea ? "filled" : "";
  btnAdd.disabled = true;
  if (descs.length === 1) {
    selDesc.value = descs[0];
    selDesc.className = "filled";
    btnAdd.disabled = false;
  }
}

function onDescChange() {
  selDesc.className = selDesc.value ? "filled" : "";
  btnAdd.disabled = !(selTarea.value && selDesc.value);
}
// ── queue logic ──
function addToQueue() {
  const tarea = selTarea.value;
  const desc = selDesc.value;
  if (!tarea || !desc) return;
  // evitar duplicado exacto
  if (queue.some((i) => i.tarea === tarea && i.desc === desc)) return;
  queue.push({
    tarea,
    desc
  });
  renderQueue();
  renderResult();
  // reset desc selector para facilitar añadir otra del mismo rol/tarea
  selDesc.value = "";
  selDesc.className = "";
  btnAdd.disabled = true;
}

function removeFromQueue(idx) {
  queue.splice(idx, 1);
  renderQueue();
  renderResult();
}

function renderQueue() {
  queueEl.innerHTML = "";
  queue.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "queue-item";
    div.innerHTML = `
      <span class="queue-tarea">${item.tarea}</span>
      <span class="queue-desc">${item.desc}</span>
      <button class="queue-remove" onclick="removeFromQueue(${i})">✕</button>`;
    queueEl.appendChild(div);
  });
}
// ── result: merge same-tarea entries ──
function buildImputacion() {
  if (!queue.length) return null;
  // agrupar por tarea preservando orden de primera aparición
  const map = new Map();
  queue.forEach(({ tarea, desc }) => {
    if (!map.has(tarea)) map.set(tarea, []);
    if (!map.get(tarea).includes(desc)) map.get(tarea).push(desc);
  });
  // formatear: "Tarea: desc1; desc2" por grupo, grupos separados por " + "
  return [...map.entries()]
    .map(([tarea, descs]) => `${tarea}: ${descs.join("; ")}`)
    .join(" + ");
}

function renderResult() {
  const txt = buildImputacion();
  if (!txt) {
    resultEl.textContent = "Añade al menos una tarea para ver la imputación";
    resultEl.className = "result-text empty";
    btnRow.style.display = "none";
  } else {
    resultEl.textContent = txt;
    resultEl.className = "result-text";
    btnRow.style.display = "flex";
  }
}
// ── helpers ──
function populate(sel, opts, activeLabel, disabledLabel) {
  sel.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = opts.length ? activeLabel : disabledLabel;
  sel.appendChild(ph);
  opts.forEach((o) => {
    const el = document.createElement("option");
    el.value = el.textContent = o;
    sel.appendChild(el);
  });
}

function copyText() {
  copy(resultEl.textContent, badgeOk);
}

function copyRec(btn, txt) {
  navigator.clipboard.writeText(txt).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = "✓ Copiado";
    btn.style.color = "var(--success-text)";
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.color = "";
    }, 2000);
  });
}

function copy(txt, badge) {
  navigator.clipboard
    .writeText(txt)
    .then(() => flash(badge))
    .catch(() => {
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      flash(badge);
    });
}

function flash(b) {
  b.classList.add("visible");
  setTimeout(() => b.classList.remove("visible"), 2200);
}

function resetAll() {
  queue = [];
  renderQueue();
  renderResult();
  selRol.value = "";
  onRolChange();
}
