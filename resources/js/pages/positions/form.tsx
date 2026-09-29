import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import PositionController from '@/actions/App/Http/Controllers/PositionController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/positions';

type Position = {
    id: number;
    name: string;
    value: string;
};

type Props = {
    position?: Position;
};

export default function Form({ position }: Props) {
    const editing = position !== undefined;

    const form = useForm({
        name: position?.name ?? '',
        value: position ? position.value.replace('.', ',') : '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editing) {
            form.put(PositionController.update.url(position));
        } else {
            form.post(PositionController.store.url());
        }
    };

    return (
        <>
            <Head title={editing ? 'Edytuj pozycję' : 'Dodaj pozycję'} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title={editing ? 'Edytuj pozycję' : 'Dodaj pozycję'}
                />

                <form
                    onSubmit={submit}
                    className="max-w-md space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nazwa</Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                            autoFocus
                            placeholder="np. Konto oszczędnościowe"
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="value">Wartość w PLN</Label>
                        <Input
                            id="value"
                            inputMode="decimal"
                            value={form.data.value}
                            onChange={(event) =>
                                form.setData('value', event.target.value)
                            }
                            placeholder="np. 1 500,50"
                        />
                        <InputError message={form.errors.value} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={form.processing}>
                            Zapisz
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={index()}>Anuluj</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
