/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import Store from "../app/Store.js";
import store from "../__mocks__/store.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

/*
  test('click on the eye icon, check if handleClickIconEye = OK', () => {
    const eyeIcon = screen.getByTestId("icon-eye");
    const handleClickIconEye = jest.fn((e) => bills.handleClickIconEye(e, bills[0]));
    fireEvent.click(eyeIcon[0]);
    expect(handleClickIconEye).toHaveBeenCalled();      
  })
*/
})

test("handleClickNewBill redirect to correct route", () => {
  const onNavigate = jest.fn();

  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Admin",
    })
  );
  const bills = new Bills({
    document,
    localStorage: localStorageMock,
    store: null,
    onNavigate,
  });

  bills.handleClickNewBill();

  expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
});

test("getBills function without store", () => {
  const onNavigate = jest.fn();

  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Admin",
    })
  );
  const bills = new Bills({
    document,
    localStorage: localStorageMock,
    store: null,
    onNavigate,
  });

  const result = bills.getBills();

  expect(result).toBe(undefined);
});

test("getBills function return a good result", () => {
  const onNavigate = jest.fn();

  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Admin",
    })
  );
  const bills = new Bills({
    document,
    localStorage: localStorageMock,
    store: store,
    onNavigate,
  });

  const result = bills.getBills();

  expect(result).toBeTruthy();
});