import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PositionController from '@/actions/App/Http/Controllers/PositionController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { create, edit, index } from '@/routes/positions';

type Position = {
    id: number;
    name: string;
    value: string;
};

type Props = {
    positions: Position[];
    total: number;
};

const currency = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
});

export default function Index({ positions, total }: Props) {
    return (
        <>
            <Head title="Majątek" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Majątek"
                    description="Lista pozycji majątku i ich łączna wartość."
                />

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <p className="text-sm text-muted-foreground">Suma</p>
                    <p className="text-3xl font-semibold tracking-tight">
                        {currency.format(Number(total))}
                    </p>
                </div>

                {positions.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                        <p className="text-muted-foreground">Brak pozycji</p>
                        <Button asChild>
                            <Link href={create()}>Dodaj pozycję</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 text-muted-foreground dark:border-sidebar-border">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Nazwa
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Wartość
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            <span className="sr-only">
                                                Akcje
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {positions.map((position) => (
                                        <PositionRow
                                            key={position.id}
                                            position={position}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <Button asChild>
                                <Link href={create()}>Dodaj pozycję</Link>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

function PositionRow({ position }: { position: Position }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleDelete = () => {
        router.delete(PositionController.destroy.url(position), {
            preserveScroll: true,
            onSuccess: () => setConfirmOpen(false),
        });
    };

    return (
        <tr className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
            <td className="px-4 py-3">{position.name}</td>
            <td className="px-4 py-3">
                {currency.format(Number(position.value))}
            </td>
            <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit(position)}>Edytuj</Link>
                    </Button>

                    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                Usuń
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>
                                Usunąć pozycję „{position.name}”?
                            </DialogTitle>
                            <DialogDescription>
                                Tej operacji nie można cofnąć.
                            </DialogDescription>
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">
                                        Anuluj
                                    </Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Usuń
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </td>
        </tr>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Majątek',
            href: index(),
        },
    ],
};
