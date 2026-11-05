const K = {
  key: "clinic_v1",
  today: "2026-11-05",
  seed() {
    return {
      patients: [
        { id: 1, name: "Anita Rao", age: 34, phone: "98490 11021", note: "Recurrent sinusitis. Sensitive to cold drinks.", visits: [{ date: "2026-10-12", complaint: "Frontal headache, worse mornings", rx: "Nux vom 30, 4 days", follow: "2026-10-26" }] },
        { id: 2, name: "Karim Shaik", age: 51, phone: "90001 44218", note: "Here for sleep and acidity.", visits: [{ date: "2026-09-02", complaint: "Burning two hours after meals", rx: "Iris v 30", follow: "2026-09-20" }] },
        { id: 3, name: "Meera Iyer", age: 8, phone: "98850 77310", note: "Mother attends. Recurrent colds each term.", visits: [] }
      ],
      stock: [
        { name: "Nux vom 30", bottles: 12 },
        { name: "Bryonia 30", bottles: 8 },
        { name: "Iris v 30", bottles: 4 },
        { name: "Ars alb 200", bottles: 6 }
      ],
      slots: [
        { time: "09:30", patient: "Anita Rao" }, { time: "10:00", patient: "Karim Shaik" },
        { time: "10:30", patient: "" }, { time: "11:00", patient: "Meera Iyer" },
        { time: "11:30", patient: "" }, { time: "16:00", patient: "" },
        { time: "16:30", patient: "" }, { time: "17:00", patient: "" }
      ]
    };
  },
  state() {
    let s;
    try { s = JSON.parse(localStorage.getItem(this.key)) || this.seed(); } catch (e) { s = this.seed(); }
    if (!s.stock) s.stock = this.seed().stock;
    return s;
  },
  save(s) { localStorage.setItem(this.key, JSON.stringify(s)); },
  patient(id) { return this.state().patients.find((p) => p.id === +id); },
  chrome(active) {
    const links = [["index.html", "Clinic", "home"], ["schedule.html", "Today", "day"], ["patients.html", "Patients", "people"], ["register.html", "Register", "reg"], ["dispensary.html", "Dispensary", "rx"], ["about.html", "Practice", "about"]];
    document.body.insertAdjacentHTML("afterbegin", `<header><a class="logo" href="index.html">Prakriti Clinic</a><nav>${links.map((l) => `<a class="${active === l[2] ? "on" : ""}" href="${l[0]}">${l[1]}</a>`).join("")}</nav></header>`);
    document.body.insertAdjacentHTML("beforeend", `<footer><span>Prakriti Clinic · demonstration, not a real practice</span><span><a href="../">All demos</a></span></footer>`);
  }
};
if (!localStorage.getItem(K.key)) K.save(K.seed());
