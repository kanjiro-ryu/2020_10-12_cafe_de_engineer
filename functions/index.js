const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore(); 

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.calcRanking = functions.pubsub.schedule('1 0 * * *').timeZone('Asia/Tokyo').onRun(async () => {
  let thisMonthContents = [];
  let thisMonth1 = {contents:[], rank:1};
  let thisMonth2 = {contents:[], rank:2};
  let thisMonth3 = {contents:[], rank:3};
  let thisMonth4 = {contents:[], rank:4};
  let thisMonth5 = {contents:[], rank:5};
  
  const today = new Date();
  let dayBefore30 = new Date();
  dayBefore30.setDate(dayBefore30.getDate() -30);

  await firestore.collection('upload-contents')
  .where('uploadDate', '>=', dayBefore30)
  .where('uploadDate', '<', today)
  .get().then(snapshot =>  
    snapshot.forEach(doc => {
    let content = doc.data()
    content.id = doc.id;
    content.favoriteCount = content.favorites.length;
    thisMonthContents.push(content);
  }))
  thisMonthContents.sort((a,b) => {
    if(a.favoriteCount > b.favoriteCount){return -1}
    if(a.favoriteCount < b.favoriteCount){return 1}
    return 0;
  })
  let count,tmp;
  thisMonthContents.forEach((content,index) => {
    if(content.favoriteCount !== tmp){
      count = index + 1;
      tmp = content.favoriteCount;
    }
    content.ranking = count
    if(content.ranking === 1 && content.favoriteCount > 0){
      thisMonth1.contents.push({
        'contentId': content.id,
        'rank':content.ranking,
        'favoriteCounts':content.favoriteCount
      })
    }else if(content.ranking === 2 && content.favoriteCount > 0){
      thisMonth2.contents.push({
        'contentId': content.id,
        'rank':content.ranking,
        'favoriteCounts':content.favoriteCount
      });
    }else if(content.ranking === 3 && content.favoriteCount > 0){
      thisMonth3.contents.push({
        'contentId': content.id,
        'rank':content.ranking,
        'favoriteCounts':content.favoriteCount
      });
    }else if(content.ranking === 4 && content.favoriteCount > 0){
      thisMonth4.contents.push({
        'contentId': content.id,
        'rank':content.ranking,
        'favoriteCounts':content.favoriteCount
      });
    }else if(content.ranking === 5 && content.favoriteCount > 0){
      thisMonth5.contents.push({
        'contentId': content.id,
        'rank':content.ranking,
        'favoriteCounts':content.favoriteCount
      });
    }
  })

firestore.collection('rankings').doc('1').set(
  {contents: thisMonth1.contents}, {merge: true})
firestore.collection('rankings').doc('2').set(
  {contents: thisMonth2.contents}, {merge: true})
firestore.collection('rankings').doc('3').set(
  {contents: thisMonth3.contents}, {merge: true})
firestore.collection('rankings').doc('4').set(
  {contents: thisMonth4.contents}, {merge: true})
firestore.collection('rankings').doc('5').set(
  {contents: thisMonth5.contents}, {merge: true})
});
