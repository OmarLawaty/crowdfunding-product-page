// Pledges Object
const pledges = [
  {
    name: 'no-reward',
    minimum: 1,
    left: 0
  },

  {
    name: 'bamboo-stand',
    minimum: 25,
    left: 101
  },

  {
    name: 'black-edition-stand',
    minimum: 75,
    left: 64
  },

  {
    name: 'mahogany-special-edition',
    minimum: 200,
    left: 0
  }
];

const pledgesBoard = {
  totalEarnings: {
    collected: 89914,
    total: 100000
  },

  totalBackers: 5007
};

// // // // // On page loading // // // // // //
modalPledge('show');
disableOutOfStock();
toPercent();

// // // // // Global variables // // // // // //
const pledgesModalCards = document.querySelectorAll('.modal-pledge');
const fastSelection = document.querySelectorAll('.pledges');
const pledgesLeft = document.querySelectorAll('.pledges-left');
const pledgesModalLeft = document.querySelectorAll('.pledges-left-modal');

// // // // // Main functions // // // // //
// Bookmark button
const bookmark = document.querySelector('.bookmark');
const bookmarkText = document.querySelector(`.bookmark-caption`);
bookmark.onclick = () => {
  bookmarkText.innerHTML === 'Bookmark'
    ? (bookmarkText.innerHTML = 'Bookmarked')
    : (bookmarkText.innerHTML = 'Bookmark');
  bookmark.classList.toggle('bookmarked');
};

// // // // // // // //
// Nav Toggler
const navToggler = document.querySelector('.humburger');
const nav = document.querySelector('nav');

navToggler.addEventListener('click', () => {
  nav.classList.toggle('open');
  document.body.classList.toggle('no-slider');
});

// // // // // // // //
// fast selection
fastSelection.forEach(element => {
  element.onclick = e => {
    if (e.target.classList.contains('select')) {
      document.querySelector(
        `.${element.classList[1]}.modal-pledge input[type=radio]`
      ).checked = true;
      checkActiveRadio();
      setTimeout(
        setAtTheTop(
          document.querySelector('.on'),
          document.querySelector('.dimmer.modals')
        ),
        200
      );
    }
  };
});

// // // // // // // //
// Select active radio button
document.querySelectorAll('input[type=radio]').forEach(
  elem =>
    (elem.onchange = e => {
      checkActiveRadio();
      setTimeout(
        setAtTheTop(
          document.querySelector('.on'),
          document.querySelector('.dimmer.modals')
        ),
        200
      );
    })
);

// // // // // // // //
// Reset all radio buttons when click on the main back button
document.querySelector('.global-back').onclick = () => {
  restAll();
};

// // // // // Semantic UI // // // // //
function modalPledge(state) {
  $('.pledges.modal').modal('attach events', '.open-menu', state);
}

// // // // // Helper functions // // // // //
// set active
function pledgeCardsModal(parent) {
  parent.onclick = e => {
    if (e.target.classList.contains('checked')) {
      pledgesModalCards.forEach(elem => elem.classList.remove('on'));
      parent.classList.add('on');
    }
  };
}

// // // // // // // //
// Check the active radio button
function checkActiveRadio() {
  pledgesModalCards.forEach(elem => elem.classList.remove('on'));
  pledgesModalCards.forEach(elem => {
    if (
      document.querySelector(`.${elem.classList[1]} input[type=radio]`).checked
    ) {
      elem.classList.add('on');
      checkValid(elem);
    }
  });
}

// // // // // // // //
// Reset radio buttons
function restAll() {
  document.querySelectorAll('.checked').forEach(elem => (elem.checked = false));
  checkActiveRadio();
}

// // // // // // // //
// Go To
function setAtTheTop(theElement, whereToCenter = 'window') {
  setTimeout(() => {
    Element.prototype.documentOffsetTop = function () {
      return (
        this.offsetTop +
        (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0)
      );
    };

    var top = theElement.documentOffsetTop() - 20;
    whereToCenter.scrollTo(0, top);
  }, 500);
}

// // // // // // // //
// Check if valid
function checkValid(parent) {
  let activeCard = document.querySelector(`.${parent.classList[1]} .proceed`);
  activeCard.onclick = () => {
    for (let i = 0; i < pledges.length; i++) {
      if (pledges[i].name == parent.classList[1]) {
        const input = document.querySelector(
          `.${parent.classList[1]} input[type=number]`
        );

        // update all
        if (input.value >= pledges[i].minimum) {
          pledgesBoard.totalEarnings.collected =
            Number(pledgesBoard.totalEarnings.collected) + Number(input.value);
          pledgesBoard.totalBackers++;
          pledges[i].left--;
          updateAll();

          // Pledges modal setting
          activeCard.classList.add('approve');

          // Show thanks modal
          document.querySelector('.thanks').classList.remove('closed');
          document.body.classList.add('no-slider');

          // Remove error message
          input.parentElement.classList.remove('error');
        } else {
          // Pledges modal setting
          activeCard.classList.remove('approve');

          // Add error message
          input.parentElement.classList.add('error');
        }
      }
    }
  };
}

// // // // // // // //
// Remove thanks modal
document.querySelector('.got-it').onclick = () => {
  document.querySelector('.thanks').classList.add('closed');
  document.body.classList.remove('no-slider');
  setAtTheTop(document.querySelector('.section2'), window);
};

// // // // // // // //
// To USD
const toUSD = number => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(number);
};

// // // // // // // //
// Update all values
function updateAll() {
  document.querySelector('.collected-money').innerHTML = toUSD(
    pledgesBoard.totalEarnings.collected
  );

  document.querySelector('.total-money').innerHTML = toUSD(
    pledgesBoard.totalEarnings.total
  );

  document.querySelector('.total-backers').innerHTML =
    new Intl.NumberFormat().format(pledgesBoard.totalBackers);

  for (let i = 1; i < pledges.length; i++) {
    pledgesLeft[i - 1].innerHTML = pledges[i].left;
    pledgesModalLeft[i - 1].innerHTML = pledges[i].left;
  }
  disableOutOfStock();
  toPercent();
}

// // // // // // // //
// Disable out of stock
function disableOutOfStock() {
  for (let i = 1; i < pledges.length; i++) {
    if (pledges[i].left <= 0) {
      document
        .querySelectorAll(`.${pledges[i].name}`)
        .forEach(ele => ele.classList.add('disabled'));
      document
        .querySelector(`.${pledges[i].name} .select`)
        .classList.add('disabled');
    }
  }
}

// // // // // // // //
// To Percent
function toPercent() {
  let earningsInPercent =
    (pledgesBoard.totalEarnings.collected * 100) /
    pledgesBoard.totalEarnings.total;

  if (earningsInPercent <= 100) {
    document.querySelector('.earned-money-bar').style.width =
      earningsInPercent + '%';
  } else {
    document.querySelector('.earned-money-bar').style.width = 100 + '%';
  }
}
