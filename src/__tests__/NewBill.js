/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import { ROUTES_PATH} from "../constants/routes.js";
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    //to-do write assertion
    test("We have the title", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBillTitle = screen.getByText("Envoyer une note de frais");
      expect(newBillTitle).toBeTruthy() 
    })

    test("We have the form and the submit button", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const submitBtn = document.getElementById("btn-send-bill");
      expect(submitBtn).toBeTruthy()
      expect(screen.getAllByTestId("form-new-bill")).toBeTruthy();
    })

    test("we have all the elements of the form", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const expenseType = screen.getByTestId('expense-type')
      const expenseName = screen.getByTestId('expense-name')
      const datepicker = screen.getByTestId('datepicker')
      const amount = screen.getByTestId('amount')
      const vat = screen.getByTestId('vat')
      const pct = screen.getByTestId('pct')
      const commentary = screen.getByTestId('commentary')
      const file = screen.getByTestId('file')

      expect(expenseType).toBeTruthy;
      expect(expenseName).toBeTruthy;
      expect(datepicker).toBeTruthy;
      expect(amount).toBeTruthy;
      expect(vat).toBeTruthy;
      expect(pct).toBeTruthy;
      expect(commentary).toBeTruthy;
      expect(file).toBeTruthy;
    })
    
    //Test each required input with the alerte for image
    test("The function return true with the good image format", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = jest.fn();
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const newBill = new NewBill({
        document,
        localStorage: localStorageMock,
        store: store,
        onNavigate,
      });
      const image = "preview-facture-free-201801-pdf-1.jpg"
      expect(newBill.checkExtension(image)).toBeTruthy()
    })

    test("We have the alert when we put the wrong image format", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = jest.fn();
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const newBill = new NewBill({
        document,
        localStorage: localStorageMock,
        store: store,
        onNavigate,
      });
      const image = "preview-facture-free-201801-pdf-1.png"
      expect(newBill.checkExtension(image)).toBe(false)
    })

    //Test the submition of the form
    
    test("test handleSubmit", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = jest.fn();
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      const newBill = new NewBill({
        document,
        localStorage: localStorageMock,
        store: store,
        onNavigate,
      });

      //Form element//
      const expenseType = screen.getByTestId('expense-type');     //mendatory
      const expenseName = screen.getByTestId('expense-name');
      const datepicker = screen.getByTestId('datepicker');      //mendatory
      const amount = screen.getByTestId('amount');             //mendatory
      const vat = screen.getByTestId('vat');
      const pct = screen.getByTestId('pct');                 //mendatory
      const commentary = screen.getByTestId('commentary');
      const file = screen.getByTestId('file');             //mendatory
      const date = new Date();

      fireEvent.change(expenseType, { target: { value: 'Transport' } });
      fireEvent.change(expenseName, { target: { value: 'Name' } });
      fireEvent.change(datepicker, { target: { value: date } });
      fireEvent.change(amount, { target: { value: 50 } });
      fireEvent.change(vat, { target: { value: 10 } });
      fireEvent.change(pct, { target: { value: 20 } });
      fireEvent.change(commentary, { target: { value: 'commentary' } });
      fireEvent.change(file, { target: {fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234'} });    
    })
    //Test if we go back on bills page
/*
    test("test take the good root after handleSubmit() sucess", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = jest.fn();
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const newBill = new NewBill({
        document,
        localStorage: localStorageMock,
        store: store,
        onNavigate,
      });
      const response = store.update(newBill);
      newBill.handleSubmit(response)
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
    })
*/
  })
})