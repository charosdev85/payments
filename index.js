"use strict";

// DATA
let USERS = [
  {
    firstName: "Alisher",
    lastName: "Qobilov",
    username: "alisherqobilov",
    password: "@alisher2020",
    card: {
      balans: 16000,
      cardType: "HUMO",
      fullName: "Alisher Qobilov",
      cardNumber: 1234_5678_9123_4567,
      date: "01/23",
      transfers: [],
    },
  },
  {
    firstName: "Mahmud",
    lastName: "Qobilov",
    username: "mahmudqobilov",
    password: "@mahmud2020",
    card: {
      balans: 16000,
      cardType: "HUMO",
      fullName: "Mahmud Qobilov",
      cardNumber: 1234_5678_9123_6745,
      date: "01/23",
      transfers: [],
    },
  },
  {
    firstName: "Elyor",
    lastName: "Qobilov",
    username: "elyorqobilov",
    password: "@elyor2020",
    card: {
      balans: 16000,
      cardType: "HUMO",
      fullName: "Elyor Qobilov",
      cardNumber: 1234_5678_9123_1620,
      date: "01/23",
      transfers: [],
    },
  },
  {
    firstName: "Ozodbek",
    lastName: "Qobilov",
    username: "ozodbekqobilov",
    password: "@ozodbek2020",
    card: {
      balans: 16000,
      cardType: "HUMO",
      fullName: "Ozodbek Qobilov",
      cardNumber: 1234_5678_9123_0401,
      date: "01/23",
      transfers: [],
    },
  },
  {
    firstName: "Abbos",
    lastName: "Qobilov",
    username: "abbosqobilov",
    password: "@abbos2020",
    card: {
      balans: 16000,
      cardType: "HUMO",
      fullName: "Abbos Qobilov",
      cardNumber: 1234_5678_9123_0618,
      date: "01/23",
      transfers: [],
    },
  },
];

let USER = null;
let isVerify = false;
// inputs
const loginInput = document.querySelector(".loginInput");
const passwordInput = document.querySelector(".passwordInput");
const transferCardNumberInput = document.querySelector(".transfer-card-number");
const transferAmountInput = document.querySelector(".transfer-amount");
//buttons
const loginButton = document.querySelector(".loginButton");
const logOut = document.querySelector(".log-out");
const transferButton = document.querySelector(".transfer-button");

// pages
const loginPage = document.querySelector(".login-page");
const paymentPage = document.querySelector(".payment-page");

// elements
const title = document.querySelector(".title");
const cardType = document.querySelector(".card-type");
const cardAmount = document.querySelector(".amount");
const cardFullName = document.querySelector(".fullName");
const cardNumber = document.querySelector(".card-num");
const cardDate = document.querySelector(".card-date");
const allHistory = document.querySelector(".all-history");
const inComeMoney = document.querySelector(".in");
const outcomeMoney = document.querySelector(".out");
// custom library
const currencyFormatter = (money) => {
  return money.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const writeAllHistory = () => {
  const minus = USER?.card?.transfers
    ?.filter((tr) => tr.transferType === "out")
    .reduce((acc, tr) => acc + tr.howMach, 0);
  const plus = USER?.card?.transfers
    ?.filter((tr) => tr.transferType === "in")
    .reduce((acc, tr) => acc + tr.howMach, 0);
  inComeMoney.textContent = `+ ${currencyFormatter(plus)}`;
  outcomeMoney.textContent = `- ${currencyFormatter(minus)}`;
  allHistory.innerHTML = "";
  USER.card.transfers.forEach((tr) => {
    const element = `<li class="history-item">
                        <div>
                          <p class="fullName">${
                            tr.transferType === "out" ? tr.to : tr.from
                          }</p>
                          <p class="amount ${
                            tr.transferType === "out" ? "red" : "green"
                          }">${
      tr.transferType === "out" ? "-" : "+"
    } ${currencyFormatter(tr.howMach)} </p>
                        </div>
                        <div class="date">
                          <p class="full-date">${tr.date.split(" ")?.[0]}</p>
                          <p class="time">${tr.date.split(" ")?.[1]}</p>
                        </div>
                      </li>`;
    allHistory.insertAdjacentHTML("afterbegin", element);
  });
};

const writeOfCardInfo = () => {
  title.textContent = `Xush Kelibsiz ${USER.firstName}`;
  cardType.textContent = USER.card.cardType;
  cardAmount.textContent = currencyFormatter(USER.card.balans);
  cardNumber.textContent = USER.card.cardNumber
    .toString()
    .match(new RegExp(".{1,4}$|.{1,4}", "g"))
    .join(" ");
  cardDate.textContent = USER.card.date;
  cardFullName.textContent = USER.card.fullName;
};

// events
loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const login = loginInput.value;
  const password = passwordInput.value;
  loginInput.value = "";
  passwordInput.value = "";
  USER = USERS.filter(
    (user) => user.username === login && user.password === password
  )[0];
  if (!USER?.firstName) {
    alert("Login yoki Parol xato kiritildi");
    return;
  }
  alert(`Xush kelibsiz ${USER.firstName}`);
  isVerify = true;
  writeOfCardInfo();
  writeAllHistory();
  paymentPage.classList.remove("hidden");
  loginPage.classList.add("hidden");
});

const createTrObj = (cardNum, trAmount) => {
  const to = USERS.filter((u) => u.card.cardNumber === +cardNum)?.[0];
  const date = new Date();
  if (cardNum.length !== 16 || !+cardNum) {
    alert("Xatolik yuz berdi");
    return;
  }
  if (USER.card.balans < trAmount) {
    alert("Xatolik yuz berdi. Kartada mablag' yetarli emas");
    return;
  }
  if (!+trAmount) {
    alert("Xatolik yuz berdi. Mablag' to'g'ri kiritilmadi.");
    return;
  }
  const trObj = {
    from: `${USER?.firstName} ${USER?.lastName}`,
    to: `${to?.firstName} ${to?.lastName}`,
    transferType: "out",
    howMach: trAmount,
    date: `${
      date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear()
    } ${date.getHours() + ":" + date.getMinutes()}`,
  };
  USER.card.transfers.push(trObj);
  USER.card.balans = USER.card.balans - trAmount;
  USERS.map((u) => {
    if (u.card.cardNumber === +cardNum) {
      u.card.transfers.push({
        from: trObj.from,
        to: trObj.to,
        transferType: "in",
        howMach: +trAmount,
        date: trObj.date,
      });
      u.card.balans = u.card.balans + trAmount;
    }
    return u;
  });
};
transferButton.addEventListener("click", (e) => {
  e.preventDefault();
  const cardNum = transferCardNumberInput.value.replaceAll(/[^0-9]/g, "");
  const trAmount = +transferAmountInput.value.trim();
  transferCardNumberInput.value = "";
  transferAmountInput.value = "";
  createTrObj(cardNum, trAmount);
  writeOfCardInfo();
  writeAllHistory();
});
// }

logOut.addEventListener("click", () => {
  loginPage.classList.remove("hidden");
  paymentPage.classList.add("hidden");
  USER = null;
  title.textContent = "";
  allHistory.innerHTML = "";
});
