Pod::Spec.new do |s|
  s.name = 'SharlizReview'
  s.version = '1.0.0'
  s.summary = "Shows Apple's rating card (SKStoreReviewController) for Sharliz Tower"
  s.license = { :type => 'Proprietary', :text => 'Sharliz Tower' }
  s.homepage = 'https://sharliztower.com'
  s.author = 'Sharliz Tower'
  s.source = { :git => 'https://github.com/toto45678/sharliz-stack.git', :tag => s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.{swift,h,m}'
  s.ios.deployment_target = '15.0'
  s.dependency 'Capacitor'
  s.frameworks = 'StoreKit'
  s.swift_version = '5.1'
end
