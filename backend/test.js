const test = async () => {
  const BASE = 'http://localhost:3001';

  console.log('=== TEST 1: Register University ===');
  const regRes = await fetch(`${BASE}/api/university/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'LNCT University', email: 'admin@lnct.ac.in' }),
  });
  const regData = await regRes.json();
  console.log(JSON.stringify(regData, null, 2));

  if (!regData.success) {
    console.log('❌ Registration failed, stopping tests.');
    return;
  }

  const joinCode = regData.data.joinCode;
  const universityId = regData.data.id;
  console.log(`\n✅ Join Code: ${joinCode}`);

  console.log('\n=== TEST 2: Student Join University ===');
  const joinRes = await fetch(`${BASE}/api/student/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Dhruv Bhardwaj', email: 'dhruv@lnct.ac.in', joinCode }),
  });
  const joinData = await joinRes.json();
  console.log(JSON.stringify(joinData, null, 2));

  if (!joinData.success) {
    console.log('❌ Student join failed, stopping tests.');
    return;
  }

  const studentId = joinData.data.studentId;

  console.log('\n=== TEST 3: Get University Students ===');
  const studentsRes = await fetch(`${BASE}/api/university/${universityId}/students`);
  const studentsData = await studentsRes.json();
  console.log(JSON.stringify(studentsData, null, 2));

  console.log('\n=== TEST 4: Get Student Details ===');
  const studentRes = await fetch(`${BASE}/api/student/${studentId}`);
  const studentData = await studentRes.json();
  console.log(JSON.stringify(studentData, null, 2));
};

test().catch(console.error);
