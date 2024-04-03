import { getFirestore, collection, getDocs, query, where, onSnapshot, updateDoc, doc, getDoc, deleteDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { firestore } from 'firebase/app';

const db = getFirestore();

// get all data
export async function getAllData(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));

        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        return data;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
}



//get data on collection on condition
export function getAllDataOnCondition(collectionName, conditions = null, callback) {
    let q = collection(db, collectionName);

    // If a single condition is provided, convert it to an array
    if (conditions && !Array.isArray(conditions)) {
        conditions = [conditions];
    }

    // Add each condition to the query if conditions are provided
    if (conditions) {
        conditions.forEach((condition) => {
            // Check for null fields, operators, and values before adding condition
            if (condition.field && condition.operator && condition.value != null) {
                q = query(q, where(condition.field, condition.operator, condition.value));
            }
        });
    }

    return onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        callback(data);
    });
}



// delete document
const deleteDocument = async (docId, collectionName) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error removing document: ", error);
    }
};






// banusr
const banUser = async (userId, status) => {
    try {
        // Update the 'status' field of the document with the provided userId
        await updateDoc(doc(db, 'users', userId), {
            status: status
        });

        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

// update common
const updateDocsData = async (docId, collection, query) => {
    try {
        // Update the document with the provided query object
        await updateDoc(doc(db, collection, docId), query);

        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

// fetch a document
const fetchDocData = async (collection, uid) => {
    // Get the current user's ID
    // console.log(collection, uid);
    try {
        if (uid) {
            // Fetch data based on the user's ID
            const docRef = doc(db, collection, uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userSnapshot = docSnap.data();
                return userSnapshot;
            } else {
                console.log('No such document!');
                return null;
            }
        } else {
            console.log('user not found');
        }
    } catch (error) {
        console.log(error);
    }

};
// Set up a real-time listener for a document
const fetchDocDataRealtime = (collection, uid, callback) => {
    // Check if uid is provided
    if (uid) {
        // Set up the real-time listener
        const docRef = doc(db, collection, uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                callback(data); // Call the callback with the document data
            } else {
                console.log('No such document!');
                callback(null); // Call the callback with null if the document does not exist
            }
        });

        // Return the unsubscribe function to clean up the listener
        return unsubscribe;
    } else {
        console.log('user not found');
        return null;
    }
};


// all servies page
// delete servie
export const deleteService = async (serviceName) => {
    try {
        await updateDoc(doc(db, 'services', 'service_list'), {
            service: arrayRemove(serviceName)
        });
        return { success: true }; // Ensure this is returned
    } catch (error) {
        console.error('Error deleting service:', error);
        return { success: false, error }; // Ensure this is returned even on error
    }
};
// edit and update
export const editService = async (oldServiceName, newServiceName) => {
    try {
        // Remove the old service
        await updateDoc(doc(db, 'services', 'service_list'), {
            service: arrayRemove(oldServiceName)
        });
        // Add the new service
        await updateDoc(doc(db, 'services', 'service_list'), {
            service: arrayUnion(newServiceName)
        });
        // Refresh the service list after editing
    } catch (error) {
        console.error('Error editing service:', error);
    }
};
//rrrrrrrrrrrrrrr


// others--------------------------------------------------------------------------------------


// covert to sentence case
export function convertToSentenceCase(text) {
    // Split the text into an array of sentences
    let sentences = text.split(/\.|\?|\!/);

    // Loop through each sentence and capitalize the first letter
    let result = sentences.map(sentence => {
        // Trim any leading or trailing whitespace
        sentence = sentence.trim();
        // Capitalize the first letter
        if (sentence.length > 0) {
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        }
        return sentence;
    });

    // Join the sentences back together with the appropriate punctuation
    result = result.join('. ');

    return result;
}
// time converter unix
export function convertUnixTime(timestamp) {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    const formattedDateTime = date.toLocaleString();
    console.log(formattedDateTime);
    return formattedDateTime;
}

// timestamp convert
const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
};

// check expiry
const isExpired = (timestamp) => {
    const currentDate = new Date();
    const eventDate = timestamp.toDate();
    return eventDate < currentDate;
};


export { banUser, fetchDocData, formatDate, isExpired, deleteDocument, updateDocsData, fetchDocDataRealtime }