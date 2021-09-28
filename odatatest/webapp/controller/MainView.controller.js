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
		var mParameters;

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

				mParameters = {
					success: function (oData, response) {
						if (oData != undefined) {
							inputParametersModel.oData = oData;
							inputParametersModel.updateBindings();
						} else {
							console.log(response);
						}
						messageModel.oData.text = "Success";
						messageModel.updateBindings();
					},

					error: function (oError) {
						messageModel.oData.text = /"message":".+?"/.exec(oError.responseText);
						messageModel.updateBindings();
					}
				};

				this.getView().setModel(inputParametersModel, "inputParametersModel");
				this.getView().setModel(messageModel, "messageModel");
			},

			onPost: function () {
				body = {
					Fyear: Number(inputParametersModel.oData.Fyear),
					Fperiod: Number(inputParametersModel.oData.Fperiod),
					Currencykey: inputParametersModel.oData.Currencykey,
					Ratetype: inputParametersModel.oData.Ratetype,
					Rate: String(inputParametersModel.oData.Rate),
					Qty: String(inputParametersModel.oData.Qty)
				};
				delete mParameters.eTag;
				mainModel.create("/MainEntitySet", body, mParameters);
			},

			onGet: function () {
				mainModel.read("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
					",Fperiod=" + inputParametersModel.oData.Fperiod +
					",Currencykey='" + inputParametersModel.oData.Currencykey +
					"',Ratetype='" + inputParametersModel.oData.Ratetype + "')", mParameters);
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

				mParameters.eTag = 'W/"' + "'" + inputParametersModel.oData.Etag + "'" + '"';

				mainModel.update("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
					",Fperiod=" + inputParametersModel.oData.Fperiod +
					",Currencykey='" + inputParametersModel.oData.Currencykey +
					"',Ratetype='" + inputParametersModel.oData.Ratetype + "')", body, mParameters);
			},

			onDelete: function () {
				mParameters.eTag = 'W/"' + "'" + inputParametersModel.oData.Etag + "'" + '"';

				mainModel.remove("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
					",Fperiod=" + inputParametersModel.oData.Fperiod +
					",Currencykey='" + inputParametersModel.oData.Currencykey +
					"',Ratetype='" + inputParametersModel.oData.Ratetype + "')", mParameters);
			},
		});
	});