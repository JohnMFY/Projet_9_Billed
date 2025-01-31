/**
 * @jest-environment jsdom
 */

import {fireEvent, getByTestId, screen, waitFor} from "@testing-library/dom"
import mockStore from "../__mocks__/store.js";
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";


jest.mock("../app/store", () => mockStore)

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

test("getBills function return a good result", async () => {
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
    store: mockStore,
    onNavigate,
  });

  const result = await bills.getBills();
  expect(result.length).toBe(4)
  expect(result).toBeTruthy();
});

  /****************************************************/
 /*               TEST D'INTEGRATION                 */
/****************************************************/
describe('Given I am a user connected as Employee', () => {
  describe('When I am on the bills page', () => {

    test('Fetches the test bills and have all elements', async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      expect(await waitFor(() => screen.getAllByText("Billed"))).toBeTruthy();
      expect(await waitFor(() => screen.getAllByTestId("icon-window"))).toBeTruthy();
      expect(await waitFor(() => screen.getAllByTestId("icon-eye"))).toBeTruthy();
      expect(await waitFor(() => screen.getAllByTestId("btn-new-bill"))).toBeTruthy();

    })
 
    test('click "icon-eye" open the modal with all the elements',async () => {
      const onNavigate = jest.fn();

      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const bills = new Bills({
        document,
        localStorage: localStorageMock,
        store: mockStore,
        onNavigate,
      });
      const icon = screen.getAllByTestId("icon-eye")[0]
      const modale = document.getElementById("modaleFile");
      $.fn.modal = jest.fn(() => modale.classList.add("show"));
      icon.addEventListener('click', bills.handleClickIconEye(icon))
      fireEvent.click(icon)
      const modalTitle = screen.getAllByText("Justificatif");
      expect(modalTitle).toBeTruthy()    
    })

    test("all the bills appears", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      const billsTable = screen.getByTestId("tbody");
      expect(billsTable).toBeTruthy();
      
      const allBills = screen.getAllByRole("row");  
      expect(allBills).toHaveLength(5);
    })

    test('click "btn-new-bill" send us to the form', () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      const onNavigate = jest.fn();
      const bills = new Bills({
        document,
        localStorage: localStorageMock,
        store: null,
        onNavigate,
      });
    
      bills.handleClickNewBill();
    
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);

    })  
  })

  describe("Erreur API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
 
})

