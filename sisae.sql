-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 24-Jul-2020 às 01:44
-- Versão do servidor: 10.4.13-MariaDB
-- versão do PHP: 7.3.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sisae`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `alunos`
--

CREATE TABLE `alunos` (
  `matricula` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `turma` int(11) NOT NULL,
  `entrada` date NOT NULL,
  `foto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `alunos`
--

INSERT INTO `alunos` (`matricula`, `nome`, `turma`, `entrada`, `foto`) VALUES
(20201956, 'Febronio Barriga Gordorrítua', 1, '2018-02-05', 'foto-1595299283252.jpg'),
(20201957, 'Frederico Matalascallando Corcuera', 2, '2018-02-05', 'foto-1594428952550.jpg'),
(20201959, 'Patricia Jiménez', 3, '2018-02-05', 'foto-1595048901609.jpg'),
(20201960, 'El Chavo del 8', 2, '2018-02-05', 'foto-1595215239935.jpg'),
(20201961, 'La Chillindrina', 2, '2018-02-05', 'foto-1595021706360.png'),
(20201962, 'Godínez', 3, '2020-07-18', 'foto-1595109771580.jpg'),
(20201963, 'Adriano Pereira', 5, '2020-07-18', 'foto-1595214211065.jpg'),
(20201964, 'Luís Boça', 6, '2020-07-23', 'foto-1595474465998.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `artigo`
--

CREATE TABLE `artigo` (
  `numero` int(11) UNSIGNED NOT NULL,
  `texto` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `artigo`
--

INSERT INTO `artigo` (`numero`, `texto`) VALUES
(1, 'asasasasas'),
(2, 'sdfsdfsdfsdfsfd'),
(11, 'Constituem direitos dos(as) discentes:');

-- --------------------------------------------------------

--
-- Estrutura da tabela `inciso`
--

CREATE TABLE `inciso` (
  `id` int(11) NOT NULL,
  `num_inciso` int(11) NOT NULL,
  `num_romano` varchar(50) NOT NULL,
  `texto_inciso` varchar(1000) NOT NULL,
  `id_artigo` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `inciso`
--

INSERT INTO `inciso` (`id`, `num_inciso`, `num_romano`, `texto_inciso`, `id_artigo`) VALUES
(13, 1, 'I', 'Ter sua integridade física, psicológica, intelectual, moral, étnica, de crença, de\r\ngênero e de arbítrio respeitada em qualquer ambiente físico ou virtual que esteja\r\nvinculado ao IFC.', 11),
(14, 2, 'II', 'Ser informado(a) sobre o Regulamento de Conduta Discente por\r\nmeio da Coordenação de Assistência Estudantil (CAE/CGAE), ou setor\r\nequivalente do campus, no início do período letivo.', 11);

-- --------------------------------------------------------

--
-- Estrutura da tabela `turma`
--

CREATE TABLE `turma` (
  `id` int(11) NOT NULL,
  `codigo` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `turma`
--

INSERT INTO `turma` (`id`, `codigo`) VALUES
(1, 'AA18'),
(2, 'AB18'),
(3, 'AC18'),
(4, 'AA19'),
(5, 'AB19'),
(6, 'AC19');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(25) NOT NULL,
  `senha` varchar(25) NOT NULL,
  `permissao` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `username`, `senha`, `permissao`) VALUES
(1, 'zenon_barriga@gmail.com', 'Seu Barriga', 'pagueoaluguel', 1),
(2, 'bigo_rodonir@gmail.com', 'Bigo', 'bigo123', 0);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `alunos`
--
ALTER TABLE `alunos`
  ADD PRIMARY KEY (`matricula`),
  ADD KEY `fk_aluno` (`turma`);

--
-- Índices para tabela `artigo`
--
ALTER TABLE `artigo`
  ADD PRIMARY KEY (`numero`);

--
-- Índices para tabela `inciso`
--
ALTER TABLE `inciso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_artigo` (`id_artigo`);

--
-- Índices para tabela `turma`
--
ALTER TABLE `turma`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `inciso`
--
ALTER TABLE `inciso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `turma`
--
ALTER TABLE `turma`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `alunos`
--
ALTER TABLE `alunos`
  ADD CONSTRAINT `fk_aluno` FOREIGN KEY (`turma`) REFERENCES `turma` (`id`);

--
-- Limitadores para a tabela `inciso`
--
ALTER TABLE `inciso`
  ADD CONSTRAINT `inciso_ibfk_1` FOREIGN KEY (`id_artigo`) REFERENCES `artigo` (`numero`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
