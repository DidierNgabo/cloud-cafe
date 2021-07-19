const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');
const btn = document.querySelector('#btn');

const renderCafe = (doc) => {
  let li = document.createElement('li');
  let city = document.createElement('span');
  let name = document.createElement('span');
  let cross = document.createElement('div');

  //setting the ids
  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = 'X';

  //populating
  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  //deleting data
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('cafes').doc(id).delete();
  });
};
//saving data
btn.addEventListener('click', async (e) => {
  e.preventDefault();
  db.collection('cafes').add({
    name: form.name.value,
    city: form.city.value,
  });
  //clearing form
  form.name.value = '';
  form.city.value = '';
});

//real-time listener
db.collection('cafes')
  .orderBy('name')
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == 'added') {
        renderCafe(change.doc);
      } else if (change.type == 'removed') {
        let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
        cafeList.removeChild(li);
      }
    });
  });
