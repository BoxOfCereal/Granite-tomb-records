const data = {
    name: 'John',
    email: 'john@domain.com',
    message: 'Receiving forms is easy and simple now!',
  };
  
  const url = 'https://script.google.com/macros/s/AKfycbwrKpdxSYtc4mfE0JvlvRdI6EkCgf5kRpqAkWQ3seE4Ti7cfaJat5Bsu666jVTqvfaq/exec';
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => console.log('data', data))
    .catch((err) => console.log('err', err));