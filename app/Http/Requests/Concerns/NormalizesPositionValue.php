<?php

namespace App\Http\Requests\Concerns;

trait NormalizesPositionValue
{
    /**
     * Accept a comma decimal separator and spaces (e.g. "1 500,50") before validation.
     */
    protected function prepareForValidation(): void
    {
        if (! is_string($this->input('value'))) {
            return;
        }

        $this->merge([
            'value' => trim(str_replace([' ', "\xc2\xa0", ','], ['', '', '.'], $this->input('value'))),
        ]);
    }

    /**
     * @return array<int, string>
     */
    protected function valueRules(): array
    {
        return ['required', 'numeric', 'min:0', 'max:9999999999999.99', 'decimal:0,2'];
    }
}
