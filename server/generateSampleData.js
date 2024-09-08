// const { faker } = require('@faker-js/faker');
// const mongoose = require('mongoose');
// const User = require('./models/userModel');
// const Conversation = require('./models/conversationModel');
// const Message = require('./models/messageModel');

// // Helper function
// const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// const generateUsers = async () => {
//     const users = Array.from({ length: 100 }).map(() => ({
//         name: faker.person.fullName(),
//         email: faker.internet.email(),
//         password: '$2b$10$Gk/tx6x/KIuprRqvdMjc2OcrdttecJBvBSx0gzPVsc0HJtFMR6UOu',
//         phoneNo: faker.phone.number('##########'), // Generates a 10-digit number
//         friendCode: faker.string.alphanumeric(6).toUpperCase(),
//     }));
//     return User.insertMany(users);
// };

// const generateFriendsAndConversations = async (users) => {
//     const userIds = users.map(user => user._id);

//     // Randomly create friendships
//     for (let user of users) {
//         const friends = userIds.filter(id => id.toString() !== user._id.toString());
//         const selectedFriends = new Set();
//         while (selectedFriends.size < 5 && friends.length) {
//             selectedFriends.add(getRandomElement(friends));
//             friends.splice(friends.indexOf([...selectedFriends].pop()), 1);
//         }
//         user.friends = [...selectedFriends];
//         await user.save();
//     }

//     // Generate conversations and messages
//     for (let user of users) {
//         const friends = user.friends;
//         for (let friendId of friends) {
//             const conversation = new Conversation({
//                 participants: [user._id, friendId]
//             });

//             const savedConversation = await conversation.save();
//             for (let i = 0; i < 5; i++) {
//                 const senderId = getRandomElement([user._id, friendId]);
//                 const receiverId = senderId.equals(user._id) ? friendId : user._id;
                
//                 const message = new Message({
//                     senderId,
//                     receiverId,
//                     message: faker.lorem.sentence(),
//                     conversation: savedConversation._id,
//                 });
//                 await message.save();
//             }
//         }
//     }
// };

// // Main function to run the script
// const main = async () => {
//     try {
//         await mongoose.connect('mongodb+srv://mridulk896:Mridul*896@cluster0.zcauifg.mongodb.net/GameBle?retryWrites=true&w=majority&appName=Cluster0');
//         console.log('MongoDB connected!');

//         const users = await generateUsers();
//         await generateFriendsAndConversations(users);

//         console.log('Sample data generation complete!');
//     } catch (err) {
//         console.error('Error generating sample data:', err);
//     } finally {
//         mongoose.connection.close();
//     }
// };

// main();

// const User = require('./models/userModel');
// const mongoose = require('mongoose');
// const Conversation = require('./models/conversationModel');
// const Message = require('./models/messageModel');

// const populateMessagesInConversations = async () => {
//     try {
//         // Connect to MongoDB
//         await mongoose.connect('mongodb+srv://mridulk896:Mridul*896@cluster0.zcauifg.mongodb.net/GameBle?retryWrites=true&w=majority&appName=Cluster0');
//         console.log('MongoDB connected!');

//         // Find all conversations
//         const conversations = await Conversation.find().populate('participants');

//         for (let conversation of conversations) {
//             // Find messages for the current conversation
//             const messages = await Message.find({
//                 $or: [
//                     { senderId: { $in: conversation.participants.map(p => p._id) } },
//                     { receiverId: { $in: conversation.participants.map(p => p._id) } }
//                 ]
//             });

//             // Extract message IDs
//             const messageIds = messages.map(message => message._id);

//             // Update the conversation with message IDs
//             await Conversation.findByIdAndUpdate(conversation._id, { $set: { messages: messageIds } });
//         }

//         console.log('Messages populated in conversations!');
        
//     } catch (err) {
//         console.error('Error populating messages in conversations:', err);
//     } finally {
//         // Close MongoDB connection
//         mongoose.connection.close();
//     }
// };

// populateMessagesInConversations();
