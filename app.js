const STORAGE_KEY = 'school-management-state-v1';

function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createDefaultState() {
    const classId = createId('class');
    const studentId = createId('student');
    const teacherId = createId('teacher');
    const assignmentId = createId('assignment');
    const gradeId = createId('grade');

    return {
        classes: [{ id: classId, name: '6e A' }],
        students: [{ id: studentId, fullName: 'Awa Diop', birthDate: '2014-05-12', classId }],
        teachers: [{ id: teacherId, name: 'Mme Ndiaye', subjects: ['Mathématiques', 'Physique'] }],
        assignments: [{ id: assignmentId, classId, teacherId, subject: 'Mathématiques' }],
        grades: [{ id: gradeId, studentId, classId, teacherId, subject: 'Mathématiques', score: 15.5, date: '2026-08-01' }]
    };
}

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved) {
            return saved;
        }
    } catch (error) {
        console.warn('Impossible de charger l’état enregistré.', error);
    }
    return createDefaultState();
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initSchoolApp() {
    const state = loadState();

    const studentForm = document.getElementById('student-form');
    const classForm = document.getElementById('class-form');
    const teacherForm = document.getElementById('teacher-form');
    const assignmentForm = document.getElementById('assignment-form');
    const gradeForm = document.getElementById('grade-form');
    const feedback = document.getElementById('feedback');

    const studentNameInput = document.getElementById('student-name');
    const studentBirthInput = document.getElementById('student-birth');
    const studentClassSelect = document.getElementById('student-class');
    const classNameInput = document.getElementById('class-name');
    const teacherNameInput = document.getElementById('teacher-name');
    const teacherSubjectsInput = document.getElementById('teacher-subjects');
    const assignmentClassSelect = document.getElementById('assignment-class');
    const assignmentTeacherSelect = document.getElementById('assignment-teacher');
    const assignmentSubjectSelect = document.getElementById('assignment-subject');
    const gradeClassSelect = document.getElementById('grade-class');
    const gradeStudentSelect = document.getElementById('grade-student');
    const gradeTeacherSelect = document.getElementById('grade-teacher');
    const gradeSubjectSelect = document.getElementById('grade-subject');
    const gradeScoreInput = document.getElementById('grade-score');

    function setFeedback(message) {
        if (feedback) {
            feedback.textContent = message;
        }
    }

    function getClassName(classId) {
        return state.classes.find((item) => item.id === classId)?.name || 'Classe supprimée';
    }

    function getTeacherName(teacherId) {
        return state.teachers.find((item) => item.id === teacherId)?.name || 'Professeur supprimé';
    }

    function getStudentName(studentId) {
        return state.students.find((item) => item.id === studentId)?.fullName || 'Élève supprimé';
    }

    function populateClassSelect(select) {
        if (!select) {
            return;
        }
        const currentValue = select.value;
        select.innerHTML = '';
        if (!state.classes.length) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Aucune classe';
            select.appendChild(option);
            return;
        }
        state.classes.forEach((schoolClass) => {
            const option = document.createElement('option');
            option.value = schoolClass.id;
            option.textContent = schoolClass.name;
            select.appendChild(option);
        });
        if (currentValue && Array.from(select.options).some((option) => option.value === currentValue)) {
            select.value = currentValue;
        } else if (select.options.length) {
            select.value = select.options[0].value;
        }
    }

    function populateTeacherSelect(select) {
        if (!select) {
            return;
        }
        const currentValue = select.value;
        select.innerHTML = '';
        if (!state.teachers.length) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Aucun professeur';
            select.appendChild(option);
            return;
        }
        state.teachers.forEach((teacher) => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.name;
            select.appendChild(option);
        });
        if (currentValue && Array.from(select.options).some((option) => option.value === currentValue)) {
            select.value = currentValue;
        } else if (select.options.length) {
            select.value = select.options[0].value;
        }
    }

    function populateStudentSelect(select, classId) {
        if (!select) {
            return;
        }
        const currentValue = select.value;
        select.innerHTML = '';
        const filteredStudents = classId
            ? state.students.filter((student) => student.classId === classId)
            : state.students;
        if (!filteredStudents.length) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Aucun élève';
            select.appendChild(option);
            return;
        }
        filteredStudents.forEach((student) => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = student.fullName;
            select.appendChild(option);
        });
        if (currentValue && Array.from(select.options).some((option) => option.value === currentValue)) {
            select.value = currentValue;
        } else if (select.options.length) {
            select.value = select.options[0].value;
        }
    }

    function populateSubjectSelect(select, teacherId) {
        if (!select) {
            return;
        }
        const currentValue = select.value;
        select.innerHTML = '';
        const teacher = state.teachers.find((item) => item.id === teacherId);
        const subjects = teacher?.subjects || [];
        if (!subjects.length) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Aucune matière';
            select.appendChild(option);
            return;
        }
        subjects.forEach((subject) => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            select.appendChild(option);
        });
        if (currentValue && Array.from(select.options).some((option) => option.value === currentValue)) {
            select.value = currentValue;
        } else if (select.options.length) {
            select.value = select.options[0].value;
        }
    }

    function renderTables() {
        const studentsBody = document.getElementById('students-table-body');
        const classesBody = document.getElementById('classes-table-body');
        const teachersBody = document.getElementById('teachers-table-body');
        const assignmentsBody = document.getElementById('assignments-table-body');
        const gradesBody = document.getElementById('grades-table-body');

        if (studentsBody) {
            studentsBody.innerHTML = state.students.length
                ? state.students.map((student) => `
                    <tr>
                        <td>${student.fullName}</td>
                        <td>${student.birthDate}</td>
                        <td>${getClassName(student.classId)}</td>
                    </tr>
                `).join('')
                : '<tr><td colspan="3">Aucun élève inscrit</td></tr>';
        }

        if (classesBody) {
            classesBody.innerHTML = state.classes.length
                ? state.classes.map((schoolClass) => `
                    <tr>
                        <td>${schoolClass.name}</td>
                        <td>${state.students.filter((student) => student.classId === schoolClass.id).length}</td>
                    </tr>
                `).join('')
                : '<tr><td colspan="2">Aucune classe</td></tr>';
        }

        if (teachersBody) {
            teachersBody.innerHTML = state.teachers.length
                ? state.teachers.map((teacher) => `
                    <tr>
                        <td>${teacher.name}</td>
                        <td>${teacher.subjects.join(', ')}</td>
                    </tr>
                `).join('')
                : '<tr><td colspan="2">Aucun professeur</td></tr>';
        }

        if (assignmentsBody) {
            assignmentsBody.innerHTML = state.assignments.length
                ? state.assignments.map((assignment) => `
                    <tr>
                        <td>${getClassName(assignment.classId)}</td>
                        <td>${getTeacherName(assignment.teacherId)}</td>
                        <td>${assignment.subject}</td>
                    </tr>
                `).join('')
                : '<tr><td colspan="3">Aucune affectation</td></tr>';
        }

        if (gradesBody) {
            gradesBody.innerHTML = state.grades.length
                ? state.grades.map((grade) => `
                    <tr>
                        <td>${getStudentName(grade.studentId)}</td>
                        <td>${getClassName(grade.classId)}</td>
                        <td>${getTeacherName(grade.teacherId)}</td>
                        <td>${grade.subject}</td>
                        <td>${Number(grade.score).toFixed(1)} / 20</td>
                        <td>${grade.date}</td>
                    </tr>
                `).join('')
                : '<tr><td colspan="6">Aucune note</td></tr>';
        }
    }

    function refreshAllSelects() {
        populateClassSelect(studentClassSelect);
        populateClassSelect(assignmentClassSelect);
        populateClassSelect(gradeClassSelect);
        populateTeacherSelect(assignmentTeacherSelect);
        populateTeacherSelect(gradeTeacherSelect);
        const selectedAssignmentClass = assignmentClassSelect?.value || '';
        const selectedGradeClass = gradeClassSelect?.value || '';
        if (gradeStudentSelect) {
            populateStudentSelect(gradeStudentSelect, selectedGradeClass);
        }
        if (assignmentSubjectSelect) {
            populateSubjectSelect(assignmentSubjectSelect, assignmentTeacherSelect?.value || '');
        }
        if (gradeSubjectSelect) {
            populateSubjectSelect(gradeSubjectSelect, gradeTeacherSelect?.value || '');
        }
    }

    function render() {
        refreshAllSelects();
        renderTables();
    }

    if (studentForm) {
        studentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!studentNameInput.value.trim() || !studentBirthInput.value || !studentClassSelect.value) {
                setFeedback('Veuillez remplir tous les champs de l’élève.');
                return;
            }
            state.students.push({
                id: createId('student'),
                fullName: studentNameInput.value.trim(),
                birthDate: studentBirthInput.value,
                classId: studentClassSelect.value
            });
            saveState(state);
            studentForm.reset();
            setFeedback('Élève enregistré avec succès.');
            render();
        });
    }

    if (classForm) {
        classForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = classNameInput.value.trim();
            if (!name) {
                setFeedback('Veuillez saisir un nom de classe.');
                return;
            }
            state.classes.push({ id: createId('class'), name });
            saveState(state);
            classForm.reset();
            setFeedback('Classe ajoutée avec succès.');
            render();
        });
    }

    if (teacherForm) {
        teacherForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = teacherNameInput.value.trim();
            const subjects = teacherSubjectsInput.value
                .split(',')
                .map((subject) => subject.trim())
                .filter(Boolean);
            if (!name || !subjects.length) {
                setFeedback('Veuillez renseigner le nom du professeur et au moins une matière.');
                return;
            }
            state.teachers.push({ id: createId('teacher'), name, subjects });
            saveState(state);
            teacherForm.reset();
            setFeedback('Professeur ajouté avec succès.');
            render();
        });
    }

    if (assignmentForm) {
        assignmentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!assignmentClassSelect.value || !assignmentTeacherSelect.value || !assignmentSubjectSelect.value) {
                setFeedback('Veuillez sélectionner une classe, un professeur et une matière.');
                return;
            }
            state.assignments.push({
                id: createId('assignment'),
                classId: assignmentClassSelect.value,
                teacherId: assignmentTeacherSelect.value,
                subject: assignmentSubjectSelect.value
            });
            saveState(state);
            assignmentForm.reset();
            setFeedback('Affectation enregistrée avec succès.');
            render();
        });
    }

    if (gradeForm) {
        gradeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!gradeClassSelect.value || !gradeStudentSelect.value || !gradeTeacherSelect.value || !gradeSubjectSelect.value || !gradeScoreInput.value) {
                setFeedback('Veuillez remplir tous les champs de la note.');
                return;
            }
            state.grades.push({
                id: createId('grade'),
                studentId: gradeStudentSelect.value,
                classId: gradeClassSelect.value,
                teacherId: gradeTeacherSelect.value,
                subject: gradeSubjectSelect.value,
                score: Number(gradeScoreInput.value),
                date: new Date().toLocaleDateString('fr-FR')
            });
            saveState(state);
            gradeForm.reset();
            setFeedback('Note enregistrée avec succès.');
            render();
        });
    }

    if (assignmentTeacherSelect) {
        assignmentTeacherSelect.addEventListener('change', () => {
            populateSubjectSelect(assignmentSubjectSelect, assignmentTeacherSelect.value);
        });
    }

    if (gradeTeacherSelect) {
        gradeTeacherSelect.addEventListener('change', () => {
            populateSubjectSelect(gradeSubjectSelect, gradeTeacherSelect.value);
        });
    }

    if (gradeClassSelect) {
        gradeClassSelect.addEventListener('change', () => {
            populateStudentSelect(gradeStudentSelect, gradeClassSelect.value);
        });
    }

    render();
}

const smoothLinks = document.querySelectorAll('a[href^="#"]');
if (smoothLinks.length) {
    smoothLinks.forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

const aboutToggleBtn = document.getElementById('toggle-about');
const aboutContent = document.querySelector('.about-content');
if (aboutToggleBtn && aboutContent) {
    aboutToggleBtn.addEventListener('click', () => {
        const hidden = aboutContent.classList.toggle('hidden');
        aboutToggleBtn.textContent = hidden ? 'Afficher le texte' : 'Masquer le texte';
    });
}

initSchoolApp();
