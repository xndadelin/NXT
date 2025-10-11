'use client';

import { Container, Button, Table, Badge, Group, Text, TextInput, Menu, Checkbox, Divider } from "@mantine/core";
import Link from "next/link";
import useChallenges from "../utils/queries/challenges/getChallenges";
import { Error } from "../components/ui/Error";
import { useState, useEffect } from "react";
import { IconArrowDown, IconArrowUp, IconArrowsUpDown, IconFilter, IconSettings } from "@tabler/icons-react";
import useUser from "../utils/queries/user/useUser";

function Challenges() {
    const { challenges, loading, error } = useChallenges();
    const { user } = useUser()
    const [sortDirection, setSortDirection] = useState<number[]>([0, 0, 0, 0, 0]);
    const [sortedChallenges, setSortedChallenges] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterDifficulty, setFilterDifficulty] = useState<string[]>([])
    const [filterCategory, setFilterCategory] = useState<string[]>([]);

    useEffect(() => {
        setTimeout(() => {
            const filteredChallenges = challenges.filter((challenge) => {
                if (searchTerm === '') return true;
                else {
                    return challenge.title.toLowerCase().includes(searchTerm.toLowerCase());
                }
            });
            setSortedChallenges(filteredChallenges);
        }, 300);
    }, [searchTerm]);

    useEffect(() => {
        if(challenges && challenges.length > 0) {
            const filteredChallenges = challenges.filter((challenge) => {
                const matchesSearch = searchTerm === '' ||
                    challenge.title.toLowerCase().includes(searchTerm.toLowerCase());
                
                const matchesCategory = filterCategory.length === 0 ||
                    filterCategory.includes(challenge.category);

                const matchesDifficulty = filterDifficulty.length === 0 ||
                    filterDifficulty.includes(challenge.difficulty);

                return matchesSearch && matchesCategory && matchesDifficulty;
            });
            setSortedChallenges(filteredChallenges);
        }
    }, [challenges, searchTerm, filterCategory, filterDifficulty])

    useEffect(() => {
        if (challenges && challenges.length > 0) {
            setSortedChallenges([...challenges]);
        }
    }, [challenges]);

    if (loading) return null;
    if (error) return <Error number={500} />;   
    if (!challenges) return <Error number={505} />;

    const categoryCount: Record<string, number> = {};
    challenges.forEach(challenge => {
        const category = challenge.category;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    const categories = Object.keys(categoryCount);

    const difficultyCount: Record<string, number> = {
        Easy: 0, Medium: 0, Hard: 0, Insane: 0
    };
    challenges.forEach(challenge => {
        const difficulty = challenge.difficulty;
        difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
    });
    const difficulties = ['Easy', 'Medium', 'Hard', 'Insane'];

    const colors = {
        Easy: 'green',
        Medium: 'yellow',
        Hard: 'red',
        Insane: 'purple'
    }
    
    const displayChallenges = (sortedChallenges && sortedChallenges.length > 0) 
        ? sortedChallenges 
        : challenges;
    
    const rows = displayChallenges.map((challenge, index) => (
        <Table.Tr key={challenge.id} style={{cursor: 'pointer'}} onClick={() => window.location.href = `/challenges/${challenge.id}`}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{challenge.title}</Table.Td>
            <Table.Td>
                <Badge color={colors[challenge.difficulty as keyof typeof colors] || 'gray'}>{challenge.difficulty}</Badge>
            </Table.Td>
            <Table.Td>{challenge.category}</Table.Td>
            <Table.Td>{challenge.points}</Table.Td>
        </Table.Tr>
    ))

    const onSort = (column: string, colIndex: number) => {
        const newSortedChallenges = [...displayChallenges];

        const newDirection = sortDirection[colIndex] === 0 ? 1 : sortDirection[colIndex] === 1 ? -1 : 1;

        const newSortDirection = [0, 0, 0, 0, 0];
        newSortDirection[colIndex] = newDirection;
        setSortDirection(newSortDirection);
        
        switch (column) {
            case 'Title':
                newSortedChallenges.sort((a, b) => {
                    return newDirection * a.title.localeCompare(b.title)
                });
                setSortedChallenges(newSortedChallenges);
                break;
            case 'Difficulty':
                const difficultyOrder = {
                    Easy: 1,
                    Medium: 2,
                    Hard: 3,
                    Insane: 4
                }
                newSortedChallenges.sort((a, b) => {
                    const avalue = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
                    const bvalue = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
                    return newDirection * (avalue - bvalue)
                });
                setSortedChallenges(newSortedChallenges);
                break;
            case 'Category':
                newSortedChallenges.sort((a, b) => {
                    return newDirection * a.category.localeCompare(b.category)
                });
                setSortedChallenges(newSortedChallenges);
                break;
            case 'Points':
                newSortedChallenges.sort((a, b) => {
                    return newDirection * (a.points - b.points);
                });
                setSortedChallenges(newSortedChallenges);
                break;
        }
    }

    const renderSortIcon = (colIndex: number) => {
        if (sortDirection[colIndex] === 0) return <IconArrowsUpDown size={14} />;
        if (sortDirection[colIndex] === 1) return <IconArrowUp size={14} />;
        return <IconArrowDown size={14} />;
    }

    const toggleDifficultyFilter = (difficulty: string) => {
        setFilterDifficulty(prev => {
            if(prev?.includes(difficulty)) {
                return prev?.filter(d => d !== difficulty);
            }
            return [...(prev || []), difficulty];
        })
    }

    const toggleCategoryFilter = (category: string) => {
        setFilterCategory(prev => {
            if(prev.includes(category)) {
                return prev.filter(c => c !== category);
            }
            return [...prev, category];
        })
    }

    const resetFilters = () => {
        setFilterCategory([]);
        setFilterDifficulty([]);
        setSearchTerm('');
    }

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Group justify="apart" mt="md">
                <TextInput placeholder="Search challenges..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}  style={{ flex: 1, marginRight: '1rem' }} />
                {user?.user_metadata?.admin && <Button style={{ marginLeft: 'auto' }} component={Link} href={"/challenges/create"} my="md">
                    Create challenge
                </Button>}
                <Menu position="bottom-end" withArrow width={220}>
                    <Menu.Target>
                        <Button variant="light" rightSection={
                            filterDifficulty.length > 0 || filterCategory.length > 0 ? (
                                <Badge size="xs" variant="filled" color="blue" p={0} w={20} h={20}>
                                    {filterDifficulty.length + filterCategory.length}
                                </Badge>
                            ) : null
                        }>
                            <IconFilter size="1rem" />
                            <Text ml={5}>Filter</Text>
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Filter by difficulty</Menu.Label>
                        {difficulties.map((difficulty) => (
                            <Menu.Item 
                                key={difficulty} 
                                leftSection={
                                    <Checkbox checked={filterDifficulty.includes(difficulty)} onChange={() => toggleDifficultyFilter(difficulty)} />
                                }
                                rightSection={
                                    <Group gap={8} wrap="nowrap">
                                        <Badge size="xs" color={colors[difficulty as keyof typeof colors]} radius="xl" variant="filled" p={4} />
                                        <Text size="xs" c="dimmed">{difficultyCount[difficulty]}</Text>
                                    </Group>
                                }
                                onClick={() => toggleDifficultyFilter(difficulty)}
                            >
                                {difficulty}
                            </Menu.Item>
                        ))}

                        <Divider my='xs' />

                        <Menu.Label>Filter by category</Menu.Label>
                        {categories.map((category) => (
                            <Menu.Item 
                                key={category} 
                                leftSection={
                                    <Checkbox checked={filterCategory.includes(category)} onChange={() => toggleCategoryFilter(category)} />
                                }
                                rightSection={
                                    <Text size="xs" c="dimmed">{categoryCount[category]}</Text>
                                }
                                onClick={() => toggleCategoryFilter(category)}
                            >
                                {category}
                            </Menu.Item>
                        ))}

                        <Divider my='xs' />

                        <Menu.Item
                            color="blue"
                            disabled={filterCategory.length === 0 && filterDifficulty.length === 0 && searchTerm === ''}
                            onClick={resetFilters}
                        >
                            Reset all filters
                        </Menu.Item>

                    </Menu.Dropdown>
                </Menu>
            </Group>
            <Table highlightOnHover withRowBorders my="md">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            <Text>Index</Text>
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => onSort('Title', 1)}>
                            <Group gap={5}>
                                <Text>Title</Text>
                                {renderSortIcon(1)}
                            </Group>
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => onSort('Difficulty', 2)}>
                            <Group gap={5}>
                                <Text>Difficulty</Text>
                                {renderSortIcon(2)}
                            </Group>
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => onSort('Category', 3)}>
                            <Group gap={5}>
                                <Text>Category</Text>
                                {renderSortIcon(3)}
                            </Group>
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => onSort('Points', 4)}>
                            <Group gap={5}>
                                <Text>Points</Text>
                                {renderSortIcon(4)}
                            </Group>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows}
                </Table.Tbody>
            </Table>
        </Container>
    )
}

export default Challenges;