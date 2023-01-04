import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseApp } from "../firebase.config";
import { Conditions, ModifyingDataInDB, PostOrPut, Remove } from "../interface";

// intializing database object
const db = getFirestore(firebaseApp);

export async function get<T>(
  collectionID: string,
  documentID: string
): Promise<T> {
  const docRef = doc(db, collectionID, documentID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return Object.keys(docSnap.data())
      .sort()
      .reduce((accumulator: { [key: string]: any }, key) => {
        accumulator[key] = docSnap.data()[key];
        return accumulator;
      }, {}) as T;
  } else {
    return {} as T;
  }
}

export async function checkADocumentExists(
  collectionID: string,
  documentID: string
): Promise<boolean> {
  const docRef = doc(db, collectionID, documentID);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export async function getMany<T>(collectionID: string): Promise<T[]> {
  const collRef = collection(db, collectionID);
  const docSnap = await getDocs(collRef);
  var docs: Array<any> = [];
  docSnap.docs.forEach((doc) => {
    docs = [...docs, doc.data() as T];
  });
  return docs as T[];
}

export async function getWithQueries<T>(
  collectionID: string,
  ...queries: Conditions
): Promise<T[]> {
  const docRef = query(
    collection(db, collectionID),
    ...queries.map(({ field, op, on }) => where(field, op, on))
  );
  const docSnap = await getDocs(docRef);
  var docs: Array<any> = [];
  docSnap.docs.forEach((doc) => {
    docs = [...docs, doc.data() as T];
  });
  return docs as T[];
}

export const put: PostOrPut = async (args) => {
  const docRef = doc(db, args.collectionID, args.documentID);
  const key = args.dataField;
  if (key != undefined) {
    await updateDoc(docRef, { [key]: args.newData });
  }
};

export const post: PostOrPut = async (args) => {
  const docRef = doc(db, args.collectionID, args.documentID);
  const isDocExists = await checkADocumentExists(
    args.collectionID,
    args.documentID
  ).catch((e) => console.log("apiclient-checkdoc" + e));
  !isDocExists
    ? await setDoc(docRef, args.newData).catch((e) =>
        console.log(
          "apiclient-postdoc" + e + args.collectionID + " " + args.documentID
        )
      )
    : null;
};

export const removeField: Remove = async (args: ModifyingDataInDB) => {
  const docRef = doc(db, args.collectionID, args.documentID);
  if (args.dataField !== undefined) {
    await updateDoc(docRef, { [args.dataField]: deleteField() });
  }
};
