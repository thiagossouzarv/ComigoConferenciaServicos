sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Fun",
	"./utilities",
	"sap/ui/model/Filter",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Fun, Utilities, Filter, History) {
	"use22 strict";
	var Matricula = '';
	var MatriculaSupervisor = '';
	var res = '';
	return BaseController.extend("com.sap.build.standard.controleDeServicos.controller.Servicos", {
		handleRouteMatched: function (oEvent) {
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
				
				this.MatriculaSupervisor = oEvent.getParameters().data.Matricula;
				this.Matricula = oEvent.getParameters().data.Matricula;
				var aFilters = [];
				aFilters.push(new Filter("Hierarquia", sap.ui.model.FilterOperator.EQ, this.Matricula));
				this.getView().byId("listaFilas").getBinding("items").filter(aFilters);
				aFilters = [];
				aFilters.push(new Filter("Matricula", sap.ui.model.FilterOperator.EQ, this.Matricula));
				this.getView().byId("listaServico").getBinding("items").filter(aFilters);

				this.filter = aFilters;
			}
			var oPath;
			if (!this.sContext) {
				this.sContext = "Supervisor('" + this.Matricula + "')";
			}
			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}
		},
		_onPageNavButtonPress: function () {
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
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},

		_onGenericTilePress: function (oEvent) {
			this.oRouter.navTo("Funcionario", {

				MatriculaSupervisor: this.MatriculaSupervisor,
				Matricula: oEvent.getSource().getSecondStatus().getText(),
				NomeFuncionario: oEvent.getSource().getIntro(),

			}, false);

		},

		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName, {
					'Matricula': this.Matricula
				});
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		handleSearch: function (evt) {
			// create model filter
			var filters = [];
			var sQuery = evt.getSource().getValue().toUpperCase();

			if (sQuery && sQuery.length > 0) {

				var aFilters = [];
				aFilters.push(new Filter("Hierarquia", sap.ui.model.FilterOperator.EQ, this.Matricula));
				aFilters.push(new Filter("NomeFuncionario", sap.ui.model.FilterOperator.BT, sQuery));
				filters.push(aFilters);

				this.getView().byId("listaFilas").getBinding("items").filter(aFilters);

			}
			if (sQuery == "") {
				var aFilters = [];
				aFilters.push(new Filter("Hierarquia", sap.ui.model.FilterOperator.EQ, this.Matricula));
	        	filters.push(aFilters);

				this.getView().byId("listaFilas").getBinding("items").filter(aFilters);
			}

			// update list binding
			var list = this.getView().byId("listaFilas");
			var binding = list.getBinding("items");
			binding.filter(filters);

		},

		_onStandardListItemPress: function (oEvent) {
		
			var sDialogName = "Fun";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			if (!oDialog) {
				oDialog = new Fun(this.getView());
				this.mDialogs[sDialogName] = oDialog;
				oDialog.setRouter(this.oRouter);
			}
	
			var context = oEvent.getParameter("listItem").getBindingContext();
			oDialog._oControl.setBindingContext(context);

			oDialog.open();

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
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Servicos").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
		}

	});
}, /* bExport= */ true);