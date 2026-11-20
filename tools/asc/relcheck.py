import os,sys
sys.path.insert(0,'tools/asc'); from asc import *
st,b=call('GET',f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=1')
a=b['data'][0]['attributes']; log(a['versionString'],a['appStoreState'],a.get('releaseType'),a.get('earliestReleaseDate'))
