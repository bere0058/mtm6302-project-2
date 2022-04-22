// Display favorites
let iImg;
let favData;
let data = {
  fav: []
}

//Pass Favorites data from localStoraga to favData
const getFav = () => {favData = JSON.parse(localStorage.getItem('data'))};
getFav()
if (favData) {
  data.fav = favData
}

//Set Img counter
const setImgC = () => {
  if (favData) {iImg = favData.length - 1} else {iImg = 0}
};
setImgC()

//Article Display
const favDisplay = () => {
  $('.fav-section')[0].innerHTML = '';
  if (favData) {
    favData.map((img) => {
      $('.fav-section')[0].innerHTML += `
          <div id=${img.id} class="d-flex border border-1 py-3 fav-div">
            <div class="f-img-div d-flex">
              <img src=${img.src} class="f-img m-auto">
            </div>
            <div class="d-flex flex-column f-text-div justify-content-center">
              <h4 class="f-title">${img.title}</h4>
              <p class="fst-italic f-date">${img.date}</p>
              <button class="delete btn btn-danger mt-3">Delete</button>
            </div>
          </div>
        `;
        $('#'+img.id).find('.f-img').hide();
        const height = $('.f-text-div').height();
        $('.f-img').css('max-height', height*0.6);
        $('.f-img').css('max-width', height*0.6);
        $('.f-img-div').css('width', height*1.2);
        $('.f-img-div').css('height', height*1.1);
        $('#'+img.id).find('.f-img').show();
        if ($(window).width() <= 768) {
          $('.f-img').css('max-height', height);
          $('.f-img').css('max-width', height);
        }
    });
  }
}
favDisplay()


//Article Interaccions
$('#set-fav').hide();
$('body').click((e) => {
  //Click on Get a Picture
  if (e.target == $('#get-picture')[0]) {
    e.preventDefault();
    $('#set-fav').show()
    const url = 'https://api.nasa.gov/planetary/apod?api_key=fo5zCrjWeaBA6Y4jX1xcLhfay7XvhbPVpMHR2gPr&&date=' + $('#date').val()
    // Formating article
    const article = async () => {   
      await fetch(url)
        .then(response => response.json())
        .then(data => {
          $('.a-img').attr("src", data.hdurl);
          $('.a-title').html(data.title);
          $('.a-date').html(data.date);
          $('.a-explanation').html(data.explanation);
        })
  
        // Resizing article's image
        const imgB = () => {
          if ($('.a-img').width() > $('article').width()/2) {
            $('.a-img').width($('article').width()/2);
          } else {
            setTimeout(imgB, 1)
          }
        }
        const imgM = () => {
          if ($('.a-img').width() > $('article').width()*0.7) {
            $('.a-img').width($('article').width()*0.7);
          } else {
            setTimeout(imgM, 1)
          }
        }
        const imgS = () => {
          $('.a-img').width($('article').width());
        }
        if ($(window).width() > 768) {
          imgB()
        } 
        if ($(window).width() <= 768){
          imgM()
        } 
        if ($(window).width() <= 480){
          imgS()
        }
      }
      article()
  } 

  // Click on Article's Image
  const onImg = e.target == $('.a-img')[0]; 
  const offImg = $('.a-img').parent().hasClass('img-full');
  if (onImg) {
    $('.a-img').parent().addClass('img-full bg-opacity-75');
    $('.a-img').addClass('on-img')
    if ($('.a-img').height() > $(window).height()){
      $('.a-img').addClass('on-img vertical-img')
    }
  }
  if (!onImg & offImg) {
    $('.a-img').parent().removeClass('img-full bg-opacity-75');
    $('.a-img').removeClass('on-img vertical-img');
  }
})
  
//Click on Save to Favorites
$('article').click((e) => {
  let playOnce = ()=> {
    if (favData) {
      return !(favData.find(x => x.title == $('.a-title').text()))
    } else {return true}
  } 
  if (e.target == $('#set-fav')[0] & playOnce()){
    data.fav.push({
      id: iImg,
      title: $('.a-title').text(),
      date: $('.a-date').text(),
      src: $('.a-img').attr('src')
    })
    localStorage.setItem('data', JSON.stringify(data.fav))
    getFav();
    favDisplay();
    iImg++;
  }
})

// Click on Delete from Favorites
$('.fav-section').click((e) => {
  //Click on Delete Favorites
  if ($(e.target).hasClass('delete')){
    const findImg = e.target.closest('.fav-div')
    getFav()
    const index = favData.findIndex((o) => {
      return o.id == findImg.id;
    })
    if (index !== -1) favData.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(favData))
    favDisplay()
  }
})