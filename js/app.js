// Global variables
const proceedButton = document.querySelectorAll('.proceed');
const paymentPledge = document.querySelectorAll('.modal-pledge');
const radioButtons = document.querySelectorAll('.checked');
const fastSelectPledge = document.querySelectorAll('.select');
const globalBack = document.querySelector('.global-back');
const pledgesModal = document.querySelector('.modal.pledges');
const allSelectPledges = document.querySelectorAll('.open-menu');
const main = document.querySelector('main');
const bookmark = document.querySelector('.bookmark');

let paidMoney = document
  .querySelector('.paid-money')
  .innerHTML.replace(',', '');
const totalMoney = document
  .querySelector('.total-money')
  .innerHTML.replace(',', '');

let click = 'show';

// After The Page Loads
disableOutOfStock();
toPercent(paidMoney, totalMoney);

// Remove Thanks Modal
document.querySelector('.got-it').onclick = () => {
  document.querySelector('.thanks').classList.add('closed');
  document.body.classList.remove('no-slider');
  setAtTheTop(document.querySelector('.section2'), window);
};

// Payment Functions
proceedButton.forEach(Element => {
  Element.addEventListener('click', function (e) {
    const inputField = document.querySelector(
      '.' + e.target.classList[1] + '-input'
    );
    const inputFieldContainer = document.querySelector(
      '.' + e.target.classList[1] + '-input-container'
    );

    // Payment Check Variables
    // Input Value
    const inputValue = Number(inputField.value);

    // Min Value
    const minValue = Number(inputField.getAttribute('min'));

    // Compare Values
    if (inputValue >= minValue) {
      // Add Total Paid Money
      paidMoney = Number(paidMoney) + inputValue;

      // Check The Length Of The Number To Add Comma At The Correct Place
      if (paidMoney.toString().length == 5) {
        document.querySelector('.paid-money').innerHTML = addComma(
          paidMoney,
          2
        );
      } else if (paidMoney.toString().length == 6) {
        document.querySelector('.paid-money').innerHTML = addComma(
          paidMoney,
          3
        );
      }

      // Add Total Backers
      let totalBackers = Number(
        document.querySelector('.total-backers').innerHTML.replace(',', '')
      );

      totalBackers++;
      document.querySelector('.total-backers').innerHTML = addComma(
        totalBackers,
        1
      );

      // Decrease Pledges Left
      let backersLeft = document.querySelectorAll(
        '.' + e.target.classList[1] + '-backers'
      );

      backersLeft.forEach(Element => {
        Element.innerHTML = Number(Element.innerHTML) - 1;
        backersLeft.innerHTML = Element.innerHTML;
      });

      // Check Out Of Stock Pledges
      disableOutOfStock();

      // Show Thanks Modal If True
      document.querySelector('.thanks').classList.remove('closed');
      document.body.classList.add('no-slider');

      // Pledges Modal setting
      Element.classList.add('approve');
      click = 'hide';

      // Convert The Value To Percent
      toPercent(paidMoney, totalMoney);

      // Remove Error Message
      inputFieldContainer.classList.remove('error');
    } else {
      // Pledges Modal setting
      Element.classList.remove('approve');

      // Add Error Message
      inputFieldContainer.classList.add('error');
    }

    // Pledges Modal setting
    click = 'show';
  });
});

// Select Active Radio Button
pledgesModal.onclick = e => {
  const target = e.target;
  if (target.classList[0] == 'checked' || target.tagName == 'label') {
    const pledgePayment = document.querySelector(
      '.' + target.classList[1] + '-modal'
    ).classList;
    if (target.checked) {
      paymentPledge.forEach(Element => {
        Element.classList.remove('on');
      });

      pledgePayment.add('on');
      setTimeout(
        setAtTheTop(
          document.querySelector('.on'),
          document.querySelector('.dimmer.modals')
        ),
        200
      );
    }
  }
};

// Fast Selection
main.onclick = e => {
  if (e.target.classList[2] == 'open-menu') {
    paymentPledge.forEach(Element => {
      Element.classList.remove('on');
    });
  }
  if (e.target.classList[0] == 'select') {
    document
      .querySelector('.' + e.target.classList[1] + '-pledge')
      .classList.add('on');
    document.querySelector(
      '.' + e.target.classList[1] + '-pledges'
    ).checked = true;

    setAtTheTop(
      document.querySelector('.on'),
      document.querySelector('.dimmer.modals')
    );
  }
};

// Bookmark To Bookmarked
bookmark.onclick = () => {
  const bookmarkCaption = document.querySelector('.bookmark-caption');
  if (bookmarkCaption.innerHTML == 'Bookmark') {
    bookmarkCaption.innerHTML = 'Bookmarked';
    bookmark.classList.add('bookmarked');
  } else {
    bookmarkCaption.innerHTML = 'Bookmark';
    bookmark.classList.remove('bookmarked');
  }
};

// Nav Toggler
const navToggler = document.querySelector('.humburger');
const nav = document.querySelector('nav');

navToggler.addEventListener('click', () => {
  nav.classList.toggle('open');
  document.body.classList.toggle('no-slider');
});

// Helper Functions
// Disable Out Of Stock Pledges
function disableOutOfStock() {
  const pledgesLeft = document.querySelectorAll('.pledges-left');
  pledgesLeft.forEach(Element => {
    if (Element.innerHTML <= '0') {
      document.querySelector(
        '.' + Element.classList[2] + '-pledges'
      ).outerHTML =
        '<input type="radio" name="pledge-selected" class="checked left-200-pledges" value="200-or-more" id="200-or-more" disabled>';

      const disabledkit = document.querySelector(
        '.' + Element.classList[2] + '-kit'
      );

      const disabledButton = document.querySelector(
        '.' + Element.classList[2] + '-button'
      );

      const disabledPledge = document.querySelector(
        '.' + Element.classList[2] + '-pledges-modal'
      );

      disabledkit.classList.add('disabled');
      disabledButton.classList.add('disabled');
      disabledPledge.classList.add('disabled');
      disabledButton.innerHTML = ' Out of stock';
    }
  });
}

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

// To Percent
function toPercent(earned, total) {
  let earningsInPercent = (earned * 100) / total;

  if (earningsInPercent <= 100) {
    document.querySelector('.earned-money-bar').style.width =
      earningsInPercent + '%';
  } else {
    document.querySelector('.earned-money-bar').style.width = 100 + '%';
  }
}

// Add Comma
function addComma(withoutComma, commaIndex) {
  return (
    withoutComma.toString().substring(0, commaIndex) +
    ',' +
    withoutComma
      .toString()
      .substring(commaIndex, withoutComma.toString().length)
  );
}

// Reset All Radio Buttons
globalBack.onclick = e => {
  radioButtons.forEach(Element => {
    Element.checked = false;
  });
};

// SemanticUI
window.onmousemove = () => {
  $('.pledges.modal').modal('attach events', '.open-menu', click);
};
