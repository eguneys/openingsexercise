const {Firestore} = require('@google-cloud/firestore');

const firestore = new Firestore();

module.exports = (name) => {
  return new Coll(name);
};

module.exports.terminate = () => {
  return firestore.terminate();
};

function Coll(name) {
  
  let coll = firestore.collection(name);

  const $doc = doc => ({
    id: doc.id,
    ...doc.data()
  });

  this.insert = (data) =>
  coll.doc(data.id).set(data)
    .then(_ => 
      this.one(data.id));

  this.one = id =>
  coll.doc(id).get().then(_ => _.exists && $doc(_));

  this.query = fQuery =>
  fQuery(coll).get().then(qSnapshot => {
    let res = [];
    qSnapshot.forEach(dSnapshot =>
      res.push($doc(dSnapshot))
    );
    return res;
  });

  this.queryOne = fQuery =>
  this.query(fQuery).then(_ => _[0]);

  this.update = (id, update) =>
  coll.doc(id).update(update);

  this.drop = () =>
  coll.listDocuments()
    .then(refs =>
      refs.forEach(ref =>
        ref.delete()
      )
    );
  
}
