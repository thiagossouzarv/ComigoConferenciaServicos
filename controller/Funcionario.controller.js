sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/model/Filter",
	"./Desc",
	"sap/ui/core/routing/History",
	"./fragmento"

], function (BaseController, MessageBox, Utilities, Filter, Desc, History, fragmento) {
	"use strict";
	var MatriculaSupervisor = '';
	var NomeFuncionario = '';
	var Matricula = '';
	return BaseController.extend("com.sap.build.standard.controleDeServicos.controller.Funcionario", {
		handleRouteMatched: function (oEvent) {
			this.Matricula = oEvent.getParameters().data.Matricula;
			this.NomeFuncionario = oEvent.getParameters().data.NomeFuncionario;
			this.MatriculaSupervisor = oEvent.getParameters().data.MatriculaSupervisor;
			var oParams = {};
			if (oEvent.getParameters().data.context) {
				this.sContext = oEvent.getParameters().data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};
					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);
				}
			
			}
			var oPath;

			if (!this.sContext) {
				this.sContext = "FuncionariosSet('" + Matricula + "')";
			}

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}
			this.byId('Funcionario').setObjectTitle(this.NomeFuncionario);
			this.byId('Funcionario').setObjectSubtitle('Matricula - ' + this.Matricula);
				var aFilters = [];
				aFilters.push(new Filter("Matricula", sap.ui.model.FilterOperator.EQ, this.Matricula));
				this.getView().byId("listaOperacao").getBinding("items").filter(aFilters);
		},
		
		_onButtonPress: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			
			}

		},
		getQueryParameters: function (oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		Descricao: function (oEvent) {
			var sDialogName = "Desc";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Desc(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();
			this.oView.byId('label2').setText(oEvent.getParameters().listItem.getCells()[4].getText());

		},
		fragmento: function (oEvent) {

			var sDialogName = "fragmento";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new fragmento(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_onButtonPress1: function () {
			return new Promise(function (fnResolve) {
				sap.m.MessageBox.confirm("", {
					title: "Sucesso!",
					actions: ["", ""],
					onClose: function (sActionClicked) {
						fnResolve(sActionClicked === "");
					}
				});
			}).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err);
				}
			});

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Funcionario").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		}
	});
}, /* bExport= */ true);