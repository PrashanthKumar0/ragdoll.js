import { Ragdoll } from "./lib/ragdoll.js";
import { $ } from "./utils.js";

function main() {
    const canvas = $('canvas').getContext('2d');
    const ragdoll = new Ragdoll(canvas);
    ragdoll.start();
}

onload = main;