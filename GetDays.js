const getDays = () => {
  const birthdate = new Date(1995, 12, 25).getTime();
  const today = new Date().getTime();
  const age = (today - birthdate) / 1000 / 60 / 60 / 24 / 365;
  document.getElementById('age').innerHTML = age.toFixed(0);
};

getDays();

