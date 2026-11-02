// المواد الدراسية لكل سمستر.
// لإضافة مادة: أضف سطراً جديداً بالشكل  ["اسم المادة", "أيقونة", "اسم المجلد في Supabase"]
// السطر الثالث (اسم المجلد) هو اسم مجلد المادة داخل bucket الخاص بالتخزين.
export const SEMESTERS = {
 "semester3": {
  name: { ar: "السمستر الثالث (2026-2027)", en: "Semester 3 (2026-2027)" },
  subjects: [
   ["Business Communication","📱","BusinessCommunication"],
   ["Programming Methods II","💻","ProgrammingMethods2"],
   ["Accounting II","📊","Accounting2"],
   ["Internet Programming","🌐","InternetProgramming"],
   ["Principles of Finance","💰","PrinciplesOfFinance"],
   ["Probability & Statistics","📈","ProbabilityAndStatistics"],
   ["English Language III","🌎","English3"]
  ]
 },
 "semester2": {
  name: { ar: "السمستر الثاني", en: "Semester 2" },
  subjects: [
   ["Accounting I","📊","Accounting"],
   ["Arabic Language II","📖","Arabic"],
   ["Calculus","📐","Calculus"],
   ["Computer Applications for Business","💻","ComputerApplications"],
   ["English Language II","🌎","English"],
   ["Fundamentals of Information Systems","🖥️","Fundamental of information systems"],
   ["Islamic Studies II","📚","IslamicStudies"],
   ["Managing People","👥","ManagingPeople"],
   ["Programming Methods I","💻","Programming"],
   ["Sudanese Studies","🇸🇩","SudaneseStudies"]
  ]
 }
};
"semester 4":{
name :{ en :Semester 4},


]
}
};
// [المفتاح/المجلد, الأيقونة, الاسم بالإنجليزية, الاسم بالعربية]
export const MATERIALS = [
 ["Lectures","📚","Course Lectures","المحاضرات"],
 ["Exams","📝","Practice Exams","الامتحانات"],
 ["Questions","❓","Review Questions (MCQ)","أسئلة الاختيار المتعدد (١٠ أسئلة)"]
];
