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
				mainModel.setUseBatch(false);

				body = {
					Fyear: Number(inputParametersModel.getProperty("/Fyear")), //можно через getProperty
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
				mainModel.setUseBatch(false);

				mainModel.read("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
					",Fperiod=" + inputParametersModel.oData.Fperiod +
					",Currencykey='" + inputParametersModel.oData.Currencykey +
					"',Ratetype='" + inputParametersModel.oData.Ratetype + "')", mParameters);
			},

			onPut: function () {
				mainModel.setUseBatch(false);

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
				mainModel.setUseBatch(false);

				mParameters.eTag = 'W/"' + "'" + inputParametersModel.oData.Etag + "'" + '"';

				mainModel.remove("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
					",Fperiod=" + inputParametersModel.oData.Fperiod +
					",Currencykey='" + inputParametersModel.oData.Currencykey +
					"',Ratetype='" + inputParametersModel.oData.Ratetype + "')", mParameters);
			},

			onBatch: function () {
				var mParameters = { groupId: "foo", success: function (odata, resp) { console.log(resp); }, error: function (odata, resp) { console.log(resp); } };

				body = {
					Fyear: Number(inputParametersModel.oData.Fyear),
					Fperiod: Number(inputParametersModel.oData.Fperiod),
					Currencykey: inputParametersModel.oData.Currencykey,
					Ratetype: inputParametersModel.oData.Ratetype,
					Rate: String(inputParametersModel.oData.Rate),
					Qty: String(inputParametersModel.oData.Qty)
				};
				//1) устанавливаем режим "batch"
				mainModel.setUseBatch(true);
				//2) устанавливаем группы, которые необходимо отложить
				//(должны быть явно вызваны методом submitChanges, если каких-то групп здесть нет, то вызываются не явно)
				mainModel.setDeferredGroups(["foo"]);
				//3) вызываем запросы
				for (var m = 0; m < 3; m++) {
					body.Fyear += m;
					mainModel.create("/MainEntitySet", body, mParameters);
				}
				mainModel.read("/MainEntitySet(Fyear=" + inputParametersModel.oData.Fyear +
				",Fperiod=" + inputParametersModel.oData.Fperiod +
				",Currencykey='" + inputParametersModel.oData.Currencykey +
				"',Ratetype='" + inputParametersModel.oData.Ratetype + "')", mParameters);
				//4) подтверждаем отправку
				mainModel.submitChanges(mParameters);

			}
		});
	});