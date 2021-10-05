sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		var mainModel;
		var inputParametersModel;
		var messageModel;

		var body;

		return Controller.extend("odatatest.controller.MainView", {
			onInit: function () {
				console.clear();
				mainModel = this.getView().getModel("MainModel");
				mainModel.setUseBatch(false);
				inputParametersModel = new sap.ui.model.json.JSONModel(
					{
						Etag: "",
						Fyear: 0,
						Fperiod: 0,
						Currencykey: "",
						Ratetype: "",
						Rate: 0,
						Qty: 0
					});

				messageModel = new sap.ui.model.json.JSONModel(
					{
						text: ""
					}
				);

				this.getView().setModel(inputParametersModel, "inputParametersModel");
				this.getView().setModel(messageModel, "messageModel");
			},

			onPost: function () {
				body = {
					Fyear: Number(inputParametersModel.getProperty("/Fyear")), //можно через getProperty
					Fperiod: Number(inputParametersModel.oData.Fperiod),
					Currencykey: inputParametersModel.oData.Currencykey,
					Ratetype: inputParametersModel.oData.Ratetype,
					Rate: String(inputParametersModel.oData.Rate),
					Qty: String(inputParametersModel.oData.Qty)
				};

				mainModel.create("/MainEntitySet", body,
					{
						groupId: "foo",
						changeSetId: "1",

						success: function (oData) {
							inputParametersModel.oData = oData;
							inputParametersModel.updateBindings();

							messageModel.oData.text = "Success";
							messageModel.updateBindings();
						},

						error: function (oError) {
							messageModel.oData.text = /"message":".+?"/.exec(oError.responseText);
							messageModel.updateBindings();
						}
					});

				messageModel.oData.text = "Wait please";
				messageModel.updateBindings();
			},

			onGet: function () {
				mainModel.read("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
					",Fperiod=" + inputParametersModel.oData.Fperiod +
					",Currencykey='" + inputParametersModel.oData.Currencykey +
					"',Ratetype='" + inputParametersModel.oData.Ratetype + "')",
					{
						groupId: "foo",

						success: function (oData) {
							inputParametersModel.oData = oData;
							inputParametersModel.updateBindings();

							messageModel.oData.text = "Success";
							messageModel.updateBindings();
						},

						error: function (oError) {
							messageModel.oData.text = /"message":".+?"/.exec(oError.responseText);
							messageModel.updateBindings();
						}
					});

				messageModel.oData.text = "Wait please";
				messageModel.updateBindings();
			},

			onPut: function () {
				body = {
					Fyear: Number(inputParametersModel.oData.Fyear),
					Fperiod: Number(inputParametersModel.oData.Fperiod),
					Currencykey: inputParametersModel.oData.Currencykey,
					Ratetype: inputParametersModel.oData.Ratetype,
					Rate: String(inputParametersModel.oData.Rate),
					Qty: String(inputParametersModel.oData.Qty)
				};

				mainModel.update("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
					",Fperiod=" + inputParametersModel.oData.Fperiod +
					",Currencykey='" + inputParametersModel.oData.Currencykey +
					"',Ratetype='" + inputParametersModel.oData.Ratetype + "')", body,
					{
						groupId: "foo",
						eTag: 'W/"' + "'" + inputParametersModel.oData.Etag + "'" + '"',
						changeSetId: "1",

						success: function (oData, response) {
							inputParametersModel.oData.Etag = /[0-9a-zA-Z][0-9a-zA-Z]+/.exec(response.headers.etag)[0];
							inputParametersModel.updateBindings();
							
							messageModel.oData.text = "Success";
							messageModel.updateBindings();
						},

						error: function (oError) {
							messageModel.oData.text = /"message":".+?"/.exec(oError.responseText);
							messageModel.updateBindings();
						}
					});

				messageModel.oData.text = "Wait please";
				messageModel.updateBindings();
			},

			onDelete: function () {
				mainModel.remove("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
					",Fperiod=" + inputParametersModel.oData.Fperiod +
					",Currencykey='" + inputParametersModel.oData.Currencykey +
					"',Ratetype='" + inputParametersModel.oData.Ratetype + "')",
					{
						groupId: "foo",
						eTag: 'W/"' + "'" + inputParametersModel.oData.Etag + "'" + '"',
						changeSetId: "1",

						success: function (oData, response) {
							messageModel.oData.text = "Success";
							messageModel.updateBindings();
						},

						error: function (oError) {
							messageModel.oData.text = /"message":".+?"/.exec(oError.responseText);
							messageModel.updateBindings();
						}
					});

				messageModel.oData.text = "Wait please";
				messageModel.updateBindings();
			},

			onBatch: function () {
				var batchElement;
				
				batchElement = this.getView().byId("Batch");
				
				batchElement.removeStyleClass("red");
				batchElement.addStyleClass("green");

				//1) устанавливаем режим "batch"
				mainModel.setUseBatch(true);
				//2) устанавливаем группы, которые необходимо отложить
				//(должны быть явно вызваны методом submitChanges, если каких-то групп здесть нет, то вызываются неявно)
				mainModel.setDeferredGroups(["foo"]);
				//3) вызываем запросы
			},

			onSubmit: function () {
				var batchElement;

				batchElement = this.getView().byId("Batch");
				
				batchElement.removeStyleClass("green");
				batchElement.addStyleClass("red");

				//4) подтверждаем отправку
				mainModel.submitChanges(
					{
						groupId: "foo",

						success: function (odata, response) {
							mainModel.setUseBatch(false);
							mainModel.setDeferredGroups([]);
							
							console.log(odata);
							console.log(response);
						},
						error: function (error) {
							mainModel.setUseBatch(false);
							mainModel.setDeferredGroups([]);

							console.log(error);
						}
					});
				//5) заключительные операции
				messageModel.oData.text = "Wait please";
				messageModel.updateBindings();
			},

			onFunctionImport: function(){
				mainModel.callFunction("/do_something",
				{
					urlParameters: {
						something: "asfdsf"
					},

					success: function(odata, response){
						console.log(odata);
					}
				});
			},

			onSelectionChange: function(oEvent){
				inputParametersModel.oData = mainModel.getProperty(oEvent.getParameters().listItem.oBindingContexts.MainModel.sPath);
				inputParametersModel.updateBindings();
			}
		});
	});