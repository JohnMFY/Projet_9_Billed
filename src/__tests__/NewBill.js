/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import { ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js";

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
    
    //Test each required input with the alerte for image
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

      const submitBtn = document.getElementById("btn-send-bill");

    })
    //Test if we go back on bills page
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

      newBill.handleSubmit();
    
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    })
    
  })
})

  /****************************************************/
 /*               TEST D'INTEGRATION                 */
/****************************************************/

//fireEvent.type