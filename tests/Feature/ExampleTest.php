<?php

test('returns a successful response', function () {
    $response = $this->get('/home');

    $response->assertOk();
});
