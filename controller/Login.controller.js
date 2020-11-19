sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, MessageToast, Utilities, History) {
	"use strict";
	return BaseController.extend("com.sap.build.standard.controleDeServicos.controller.Login", {

		handleRouteMatched: function (oEvent) {
			var sAppId = "App5def9c451740be010f21fd13";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

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
		},
		logar: function (oEvent) {
		
			this.getView().setBusy(true);
			this.oEventLogin = oEvent;
			var oModel = oEvent.oSource.getModel();
			var oBindingContext = oEvent.getSource().getBindingContext();
			var view = this;   
			var Matricula; //= this.getView().byId("matricula").getValue();
			var Senha; // = this.oView.byId("senha").getValue();
			if (Matricula == "") {
				view.getView().setBusy(false);
				MessageBox.error("Digitar a Código do  usuario!");
			} else {
				return new Promise(function (fnResolve) {
					Matricula = this.getView().byId("matricula").getValue();
				
					Senha = this.oView.byId("senha").getValue();
					this.verificaLogin(view, oBindingContext, oModel, fnResolve, Matricula, Senha);
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						view.getView().setBusy(false);
						MessageBox.error(err.message);
					}
				});
			}
		},
		verificaLogin: function (view, oBindingContext, oModel, fnResolve, Matricula, Senha) {
			oModel.read("/LoginSet(Codigo='" + Matricula + "',Senha='" + Senha + "')", {
				success: function (resultado) {
					view.getView().setBusy(false);
					if (resultado.Nome == "Usuario e senha incorreto!") {
						MessageToast.show("Usuario ou senha Incorretos!");
					} else if (resultado.Codigo == "999999999") {
						view.nomeFuncionario = resultado.Nome;
						view.openDialog("CadastrarUsuario");
					} else if (resultado.Nome == "Usuario n\xE3o cadastrado!") {
						MessageToast.show("Tipo de usuario n\xE3o Permitido!");
					} else {
						view.oRouter.navTo("Servicos", {
							Matricula: resultado.Codigo
						});
					}
				},
				error: function (oError) {
					view.getView().setBusy(false);
				}
			});
		},
		_onGenericTilePress: function (oEvent) {
			this.oRouter.navTo("Servicos", {

				Matricula: this.getView().byId("matricula").getValue(),

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

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
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
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Login").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		}
	});
}, /* bExport= */ true);