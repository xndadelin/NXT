'use client';

import { Error } from "@/app/components/ui/Error";
import Loading from "@/app/components/ui/Loading";
import useContest from "@/app/utils/queries/contests/useContest";
import { useParams } from "next/navigation";
import { Container } from "@mantine/core";

export default function ContestPage() {
    const params = useParams();
    const { contest, loading, error } = useContest({ contestId: params.id as string})
    
    if(loading) return <Loading />;
    if(error) return <Error number={500} />
    if(!contest) return <Error number={404} />
    
    return (
        <Container>

        </Container>
    )

}