sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		var mainModel;
		var body;
		var mParameters;
		var inputParameters;

		return Controller.extend("odatatest.controller.MainView", {
			onInit: function () {
				console.clear();

				mainModel = this.getView().getModel("MainModel");
				mainModel.setUseBatch(false);

				inputParameters = new sap.ui.model.json.JSONModel(
				{
					data: {
						Etag: "",
						Fyear: 0,
						Fperiod: 0,
						Currencykey: "",
						Ratetype: "",
						Rate: 0,
						Qty: 0
					}
				});

				this.getView().setModel(inputParameters, "inputParameters");

				mParameters = {
					success: function (oData) {
						inputParameters.oData.data = oData;
						inputParameters.updateBindings();
					},

					error: function (oError) {
						console.log(oError);
					}
				};
			},
			
			onPost: function(){
				body = {
					Fyear: Number(inputParameters.oData.data.Fyear),
					Fperiod: Number(inputParameters.oData.data.Fperiod),
					Currencykey: inputParameters.oData.data.Currencykey,
					Ratetype: inputParameters.oData.data.Ratetype,
					Rate: String(inputParameters.oData.data.Rate),
					Qty: String(inputParameters.oData.data.Qty)
				};
				mainModel.create("/MainEntitySet", body, mParameters);
			},
			
			onGet: function(){
				mainModel.read("/MainEntitySet(Fyear=" + inputParameters.oData.data.Fyear + 
											 ",Fperiod=" + inputParameters.oData.data.Fperiod + 
											 ",Currencykey='" + inputParameters.oData.data.Currencykey + 
											 "',Ratetype='" + inputParameters.oData.data.Ratetype + "')", mParameters);
			},
			
			onPut: function(){
				body = {
					Fyear: Number(inputParameters.oData.data.Fyear),
					Fperiod: Number(inputParameters.oData.data.Fperiod),
					Currencykey: inputParameters.oData.data.Currencykey,
					Ratetype: inputParameters.oData.data.Ratetype,
					Rate: String(inputParameters.oData.data.Rate),
					Qty: String(inputParameters.oData.data.Qty)
				};
				mParameters = {
					eTag: 'W/"' + "'" + inputParameters.oData.data.eTag + "'" + '"'
				};
				mainModel.update("/MainEntitySet(Fyear=" + inputParameters.oData.data.Fyear + 
											   ",Fperiod=" + inputParameters.oData.data.Fperiod + 
											   ",Currencykey=" + inputParameters.oData.data.Currencykey + 
											   ",Ratetype=" + inputParameters.oData.data.Ratetype + ")", body, mParameters);
			},

			onDelete: function(){
				mParameters = {
					eTag: 'W/"' + "'" + inputParameters.oData.data.eTag + "'" + '"'
				};
				mainModel.remove("/MainEntitySet(Fyear=" + inputParameters.oData.data.Fyear + 
											   ",Fperiod=" + inputParameters.oData.data.Fperiod + 
											   ",Currencykey=" + inputParameters.oData.data.Currencykey + 
											   ",Ratetype=" + inputParameters.oData.data.Ratetype + ")", mParameters);
			},
		});
	});