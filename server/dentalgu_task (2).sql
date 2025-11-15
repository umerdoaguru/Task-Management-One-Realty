-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 15, 2025 at 03:59 PM
-- Server version: 10.6.19-MariaDB-cll-lve
-- PHP Version: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dentalgu_task`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `message_type` enum('text','image','document','follow_up') DEFAULT 'text',
  `file_path` varchar(500) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `is_follow_up` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `type` enum('task_assigned','task_updated','follow_up','reminder') DEFAULT 'task_assigned',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otpcollections`
--

CREATE TABLE `otpcollections` (
  `otp_id` int(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `code` int(10) DEFAULT NULL,
  `expiresIn` int(20) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otpcollections`
--

INSERT INTO `otpcollections` (`otp_id`, `email`, `code`, `expiresIn`, `createdAt`) VALUES
(1, 'kuldeepdoauruinfosystems@gmail.com', 224603, NULL, '2024-08-13 06:59:36.777227'),
(2, 'mohitsahu1993@gmail.com', 254910, NULL, '2024-08-22 07:31:13.481316'),
(3, 'shadab@gmail.com', 617412, NULL, '2024-09-02 07:06:14.109336'),
(4, 'kuldeepdoauruinfosystems@gmail.com', 694511, NULL, '2024-10-28 06:46:34.286922'),
(5, 'umer@gmail.com', 141174, NULL, '2024-10-28 09:38:09.772837'),
(6, 'umerqureshidoaguru@gmail.com', 284783, NULL, '2024-10-28 09:40:56.211954'),
(7, 'umerqureshi786786@gmail.com', 438900, NULL, '2024-10-28 10:06:47.009743'),
(8, 'umerqureshi786786@gmail.com', 766856, NULL, '2024-10-28 10:36:44.825756'),
(9, 'umerqureshi786786@gmail.com', 91347, NULL, '2024-10-28 10:42:44.327534'),
(10, 'umerqureshidoaguru@gmail.com', 965997, NULL, '2024-10-28 11:01:44.891003'),
(11, 'umerqureshi786786@gmail.com', 214866, NULL, '2024-10-28 11:06:44.496840'),
(12, 'umerqureshidoaguru@gmail.com', 595652, NULL, '2024-10-28 11:10:16.926784'),
(13, 'umerqureshi786786@gmail.com', 916447, NULL, '2024-10-28 11:48:37.518558'),
(14, 'umerqureshidoaguru@gmail.com', 164218, NULL, '2024-11-02 08:29:38.226751'),
(15, 'umerqureshi786786@gmail.com', 384225, NULL, '2024-11-02 08:32:31.049691'),
(16, 'umerqureshi786786@gmail.com', 49893, NULL, '2024-11-02 08:33:44.304847'),
(17, 'umerqureshi786786@gmail.com', 29892, NULL, '2024-11-02 08:43:57.239706'),
(18, 'umerqureshi786786@gmail.com', 132098, NULL, '2024-11-02 08:46:17.708877'),
(19, 'vinaydhariya21@gmail.com', 197511, NULL, '2024-11-02 10:01:02.463107'),
(20, 'shubhsoni1996th@gmail.com', 649018, NULL, '2024-11-02 12:21:31.975979'),
(21, 'vinaydhariya21@gmail.com', 52445, NULL, '2024-11-02 13:02:07.761740'),
(0, 'umerqureshi786786@gmail.com', 15577, NULL, '2024-12-25 12:09:50.640215'),
(0, 'umerqureshi786786@gmail.com', 305802, NULL, '2024-12-25 12:12:41.995921'),
(0, 'umerqureshi786786@gmail.com', 441528, NULL, '2024-12-25 12:17:33.904795'),
(0, 'umerqureshi786786@gmail.com', 969002, NULL, '2024-12-25 12:24:39.557547'),
(0, 'umerqureshi786786@gmail.com', 78049, NULL, '2024-12-25 12:28:49.622981'),
(0, 'umerqureshidoaguru@gmail.com', 922773, NULL, '2024-12-26 07:44:46.860702'),
(0, 'umerqureshidoaguru@gmail.com', 132076, NULL, '2024-12-26 07:54:38.571203'),
(0, 'umerqureshidoaguru@gmail.com', 380494, NULL, '2024-12-26 07:55:58.223044'),
(0, 'umerqureshidoaguru@gmail.com', 489279, NULL, '2025-01-02 13:55:14.473995'),
(0, 'umerqureshi786786@gmail.com', 846728, NULL, '2025-01-03 11:11:28.978719'),
(0, 'umerqureshidoaguru@gmail.com', 332411, NULL, '2025-01-03 11:13:22.214841'),
(0, 'umerqureshi786786@gmail.com', 747328, NULL, '2025-01-27 11:16:21.507521'),
(0, 'shubhamsonidoaguru@gmail.com', 739821, NULL, '2025-01-30 12:52:36.435637'),
(0, 'aryanjain@gmail.com', 53883, NULL, '2025-07-02 09:34:33.351511'),
(0, 'umerqureshi786786@gmail.com', 262860, NULL, '2025-07-02 09:34:50.923446'),
(0, 'umerqureshidoaguru@gmail.com', 602268, NULL, '2025-07-02 09:36:33.025500'),
(0, 'umerqureshidoaguru@gmail.com', 13155, NULL, '2025-07-09 09:21:45.825550'),
(0, 'deepanshu123.doaguru@gmail.com', 67550, NULL, '2025-07-09 10:15:14.479002'),
(0, 'deepanshushukla07@gmail.com', 691029, NULL, '2025-07-09 11:05:49.183231'),
(0, 'deepanshu123.doaguru@gmail.com', 577533, NULL, '2025-07-14 11:04:18.625533');

-- --------------------------------------------------------

--
-- Table structure for table `registered_data`
--

CREATE TABLE `registered_data` (
  `user_id` int(100) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `roles` varchar(255) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registered_data`
--

INSERT INTO `registered_data` (`user_id`, `user_name`, `email`, `password`, `roles`, `created_date`) VALUES
(36, 'test123', 'test123@gmail.com', '$2b$10$Cny5qq7pjQtZyTBxs.CkPuhjOMy4f.5MGo/EX/5ppnFeJmr17q3Xa', 'Employee', '2025-07-10 07:11:07'),
(37, 'Umer Qureshi', 'umerqureshi786786@gmail.com', '$2b$10$7gn4Se1JJMBF9sXfWba4vO7eIqGJfVtIVtE/U2dgAtRTb4.e6RAVC', 'Admin', '2025-07-02 09:35:27'),
(39, 'Umer Doagurur', 'umerqureshidoaguru@gmail.com', '$2b$10$DKkFAhxw8xT1LaenROL.BehcIEQtUCPhZWD9VrR0AJ9DKvidfuRXy', 'Employee', '2025-07-09 09:23:30'),
(40, 'Deepanshu', 'deepanshu123.doaguru@gmail.com', '$2b$10$UNUgp7Sr7c3h3NBkOFKjce/iDwEb5i7yrkP37vVX03QAivCndcSza', 'Employee', '2025-07-14 11:10:56'),
(41, 'Sunil Sharma', 'test@gmail.com', '$2b$10$/1X/lG3LCUxqPRdGu35bl.XpaERQ2dwUfd8VRvHuSO5NxCEmbOh5W', 'Employee', '2025-07-09 10:58:50'),
(43, 'Garima sharm', 'test@gmail.com', '$2b$10$5wHtFs2pcCX7lrRNnnHoQuHeziaBVJyNItf4oNxl.m9F2.q91Cmfa', 'Employee', '2025-07-15 13:18:53'),
(44, 'Subham singh', 'Subham@gmail.com', '$2b$10$DM4JKkW/M/fB3gB98mh8YuxktH0T56Jses5ECAwAiVhwXcJbquF96', 'Employee', '2025-07-24 11:49:38');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `assigned_to` varchar(255) DEFAULT NULL,
  `due_date` varchar(255) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `employeeId` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `assigned_to`, `due_date`, `priority`, `employeeId`, `created_at`) VALUES
(63, 'Office task', 'Deepanshu', '2025-07-05', 'High', 40, '2025-07-16 05:53:51'),
(65, 'Today\'s tasks', 'Deepanshu', '2025-07-22', 'High', 40, '2025-07-21 09:16:01'),
(69, 'Android development', 'Umer Doagurur', '2025-07-24', 'High', 39, '2025-07-24 07:42:37'),
(70, 'Office Today\'s task', 'Deepanshu', '2025-07-24', 'High', 40, '2025-07-24 07:48:16');

-- --------------------------------------------------------

--
-- Table structure for table `task_priorities`
--

CREATE TABLE `task_priorities` (
  `id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `priority_item` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `file` varchar(255) DEFAULT NULL,
  `createdTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `employeeId` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_priorities`
--

INSERT INTO `task_priorities` (`id`, `task_id`, `priority_item`, `status`, `file`, `createdTime`, `employeeId`) VALUES
(74, 63, 'task123', 'completed', 'https://task.dentalguru.software/uploads/1752652524568-Screenshot 2025-07-16 131155.jpg', '2025-07-24 08:01:39', 40),
(75, 63, 'task456', 'pending', 'https://task.dentalguru.software/uploads/1752645231224-Task Management with project assign to employee.pdf', '2025-07-24 08:01:39', 40),
(78, 65, 'Taskone', 'in-progress', 'https://task.dentalguru.software/uploads/1753089361712-DentalGuru - Doctor1.pdf', '2025-07-21 09:34:28', 40),
(79, 65, 'Tasktwo', 'completed', 'https://task.dentalguru.software/uploads/1753089361715-DentalGuru - Receptionist.pdf', '2025-07-21 09:34:38', 40),
(80, 65, 'Taskthree', 'pending', 'https://task.dentalguru.software/uploads/1753089361719-Dental Guru -Lab.pdf', '2025-07-21 09:16:01', 40),
(81, 65, 'Taskfour', 'pending', 'https://task.dentalguru.software/uploads/1753089361722-0ddc6b33-a7dd-4198-9ba8-7a374b9bfe1e.jpg', '2025-07-21 09:16:01', 40),
(82, 65, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su', 'pending', 'https://task.dentalguru.software/uploads/1753089361723-0ddc6b33-a7dd-4198-9ba8-7a374b9bfe1e.jpg', '2025-07-21 09:16:01', 40),
(94, 69, 'Get the design ready', 'completed', 'https://task.dentalguru.software/uploads/1753343027152-Ambition_One_Month_Strategy.pdf', '2025-07-24 08:09:04', 39),
(95, 70, 'Go to Market purchased stationary', 'completed', 'https://task.dentalguru.software/uploads/1753343296175-DentalGuru - Doctor1.pdf', '2025-07-24 11:50:18', 40),
(96, 70, 'Take this document and signed should be there for this person ', 'pending', NULL, '2025-07-24 07:48:16', 40);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `registered_data`
--
ALTER TABLE `registered_data`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_priorities`
--
ALTER TABLE `task_priorities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registered_data`
--
ALTER TABLE `registered_data`
  MODIFY `user_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `task_priorities`
--
ALTER TABLE `task_priorities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
