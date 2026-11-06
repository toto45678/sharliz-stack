import Foundation
import UIKit
import StoreKit
import Capacitor

// Asks iOS to show Apple's own "Enjoying Sharliz Tower?" stars card.
// Apple decides whether it really appears (at most 3 times a year, never in TestFlight).
// No network call and no data from the app, so the App Store privacy label stays "Data Not Collected".
@objc(SharlizReviewPlugin)
public class SharlizReviewPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SharlizReviewPlugin"
    public let jsName = "SharlizReview"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestReview", returnType: CAPPluginReturnPromise)
    ]

    @objc func requestReview(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
            if let scene = scenes.first(where: { $0.activationState == .foregroundActive }) ?? scenes.first {
                SKStoreReviewController.requestReview(in: scene)
                call.resolve(["asked": true])
            } else {
                call.resolve(["asked": false])
            }
        }
    }
}
