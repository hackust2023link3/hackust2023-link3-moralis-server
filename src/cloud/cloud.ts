/* eslint-disable etc/no-commented-out-code */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
declare const Parse: any;

Parse.Cloud.afterSave('ItemlistedLogs', async (request: any) => {
  console.log(`ItemlistedLogs`);
  const confirmed = request.object.get('confirmed');
  if (confirmed) {
    console.log(`ItemlistedLogs | Object: ${request.object}`);
    const ActiveItem = Parse.Object.extend('ActiveItem');

    // In case of listing update, search for already listed ActiveItem and delete
    const query = new Parse.Query(ActiveItem);
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('seller', request.object.get('seller'));
    console.log(`ItemlistedLogs | Query: ${query}`);
    const alreadyListedItem = await query.first();
    console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`);
    if (alreadyListedItem) {
      console.log(`Deleting ${alreadyListedItem.id}`);
      await alreadyListedItem.destroy();
      console.log(
        `Deleted item with tokenId ${request.object.get('tokenId')} at address ${request.object.get(
          'address',
        )} since the listing is being updated. `,
      );
    }

    // Add new ActiveItem
    const activeItem = new ActiveItem();
    activeItem.set('marketplaceAddress', request.object.get('address'));
    activeItem.set('nftAddress', request.object.get('nftAddress'));
    activeItem.set('price', request.object.get('price'));
    activeItem.set('tokenId', request.object.get('tokenId'));
    activeItem.set('seller', request.object.get('seller'));
    console.log(`Adding Address: ${request.object.get('address')} TokenId: ${request.object.get('tokenId')}`);
    console.log('Saving...');
    await activeItem.save();
  }
});

Parse.Cloud.afterSave('ItemcanceledLogs', async (request: any) => {
  console.log(`ItemcanceledLogs`);
  const confirmed = request.object.get('confirmed');
  if (confirmed) {
    console.log(`ItemcanceledLogs | Object: ${request.object}`);
    const ActiveItem = Parse.Object.extend('ActiveItem');
    const query = new Parse.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    console.log(`ItemcanceledLogs | Query: ${query}`);
    const canceledItem = await query.first();
    console.log(`ItemcanceledLogs | CanceledItem: ${JSON.stringify(canceledItem)}`);
    if (canceledItem) {
      console.log(`Deleting ${canceledItem.id}`);
      await canceledItem.destroy();
      console.log(
        `Deleted item with tokenId ${request.object.get('tokenId')} at address ${request.object.get(
          'address',
        )} since it was canceled. `,
      );
    } else {
      console.log(
        `No item canceled with address: ${request.object.get('address')} and tokenId: ${request.object.get(
          'tokenId',
        )} found.`,
      );
    }
  }
});

Parse.Cloud.afterSave('ItemboughtLogs', async (request: any) => {
  console.log(`ItemboughtLogs`);
  const confirmed = request.object.get('confirmed');
  if (confirmed) {
    console.log(`ItemboughtLogs | Object: ${request.object}`);
    const ActiveItem = Parse.Object.extend('ActiveItem');
    const query = new Parse.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    console.log(`ItemboughtLogs | Query: ${query}`);
    const boughtItem = await query.first();
    console.log(`ItemboughtLogs | boughtItem: ${JSON.stringify(boughtItem)}`);
    if (boughtItem) {
      console.log(`Deleting boughtItem ${boughtItem.id}`);
      await boughtItem.destroy();
      console.log(
        `Deleted item with tokenId ${request.object.get('tokenId')} at address ${request.object.get(
          'address',
        )} from ActiveItem table since it was bought.`,
      );
    } else {
      console.log(
        `No item bought with address: ${request.object.get('address')} and tokenId: ${request.object.get(
          'tokenId',
        )} found`,
      );
    }
  }
});