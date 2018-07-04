import { isUrl } from '../utils/utils';

const menuData = [
    {
        name:'Advertiser',
        path:'advertiser',
        children:[
            {
                name:'Advertiser Report',
                path:'advReport'
            },{
                name:'Advertiser Statement',
                path:'advStatement'
            },{
                name:'Advertiser Invoice Record',
                path:'advInvRec'
            },
            // {
            //     name:'Payment Collection From Advertiser',
            //     path:'advPaymentColle'
            // },
            {
                name:'Advertiser Credit',
                path:'advCredit'
            }
        ]
    },
    {
        name:'Publisher',
        path:'publisher',
        children:[
            {
                name:'Publisher Report',
                path:'pubReport'
            },{
                name:'Publisher Statement',
                path:'pubStatement'
            },{
                name:'Publisher Invoice Record',
                path:'pubInvRec'
            }
        ]
    }
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
