const btnContainer = document.querySelector('.tabs-wrapper'); //document.getElementsByClassName("tabs-wrapper");
const btns = btnContainer.querySelectorAll('.tablink');
// var btns = btnContainer.getElementsByClassName("tablink");

console.log('btnContainer, btns', btnContainer, btns);

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    const current = btnContainer.querySelectorAll('.active'); // document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
