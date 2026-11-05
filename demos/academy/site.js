const H = {
  key: "academy_v2",
  lessons: [
    { t: "What a hub site is", body: "A hub rolls news, documents, and people into one front door. The navigation is the contract." },
    { t: "Document checkout", body: "Checkout stops two people editing the same file. Check it back in when you are done." },
    { t: "A page is web parts", body: "Hero, news, and a library are parts. The page is only how you arrange them." },
    { t: "Check yourself", body: "One question. The score is the point." }
  ],
  seed() {
    return {
      done: {},
      tasks: [
        { id: 1, title: "Review the travel SOP", who: "You", open: true },
        { id: 2, title: "Finish lesson 2", who: "You", open: true },
        { id: 3, title: "Confirm Thursday window", who: "Lab ops", open: true }
      ],
      news: [
        { day: "4 Nov", title: "Change window Thursday", body: "Optics frozen 18:00–22:00. No cross-connect commits in that window." },
        { day: "2 Nov", title: "New runbook", body: "Deploy checklist is in Runbooks. Check it out before you edit." },
        { day: "28 Oct", title: "Course opened", body: "SharePoint, practically — four lessons, one question." }
      ],
      docs: {
        Policies: [{ name: "Leave policy.docx", who: "HR", out: false }, { name: "Travel SOP.pdf", who: "Ops", out: true, by: "Rakesh" }],
        Runbooks: [{ name: "Deploy checklist.md", who: "Eng", out: false }, { name: "Incident notes.docx", who: "SRE", out: false }]
      }
    };
  },
  state() { try { return JSON.parse(localStorage.getItem(this.key)) || this.seed(); } catch (e) { return this.seed(); } },
  save(s) { localStorage.setItem(this.key, JSON.stringify(s)); },
  chrome(active) {
    const links = [["index.html", "Home", "home"], ["news.html", "News", "news"], ["documents.html", "Documents", "docs"], ["learn.html", "Learning", "learn"], ["tasks.html", "Tasks", "tasks"], ["people.html", "People", "people"]];
    document.body.insertAdjacentHTML("afterbegin", `<header><a class="logo" href="index.html">Northline</a><nav>${links.map((l) => `<a class="${active === l[2] ? "on" : ""}" href="${l[0]}">${l[1]}</a>`).join("")}</nav></header>`);
    document.body.insertAdjacentHTML("beforeend", `<footer><span>Northline · a demonstration intranet, not a Microsoft product</span><span><a href="../">All demos</a></span></footer>`);
  }
};
if (!localStorage.getItem(H.key)) H.save(H.seed());
